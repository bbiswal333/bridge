var https_req	= require('https');
var http_req	= require('http');
var url 		= require('url');
var fs          = require('fs');
var path 		= require('path');
var npm_load	= require('./npm_load.js');

exports.register = function(app, user, local, proxy, npm, eTag, sso_enable)
{
	//get api modules	
	var xml2js 	  	  = require("xml2js").parseString;
	var iconv 	  	  = require("iconv-lite");
	var EWSClient 	  = require("./ews/ewsClient.js").EWSClient;
	var execFile  	  = require('child_process').execFile;
	var pathTrafLight = path.join( __dirname , '\\trafficlight');

	function setHeader(request, response)
	{
		var originPattern = /^(https:\/\/)(bridge\.mo\.sap\.corp|bridge-master\.mo\.sap\.corp|localhost)(:\d+)?($|\/)/;
		if ( request.headers.origin !== undefined && originPattern.test(request.headers.origin))
		{
			response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
			response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept' );
			response.setHeader('Access-Control-Allow-Credentials', 'true' );
			response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS' );
		}    	
		return response;
	}

	// FIXME - currently migrated from ews.js
	function _parseEWSDateString (ewsDateStr_s, offsetUTC_i) {
		var s = ewsDateStr_s;

		//Check whether this string seems to be valid
		if (s.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/) === -1) {
			return null;
		}

		var year = s.substr(0, 4);
		var month = parseInt(s.substr(5, 2)) - 1;
		var day = s.substr(8, 2);
		var hour = s.substr(11, 2);
		var minute = s.substr(14, 2);
		var second = s.substr(17, 2);

		var d = new Date(year, month, day, hour, minute, second);

		return new Date(d.getTime() + (offsetUTC_i * 3600000)); //3600000 milliseconds are one hour
	}	
	
	function parseEWSDateStringAutoTimeZone(ewsDateStr_s) {
			return _parseEWSDateString(ewsDateStr_s, (new Date().getTimezoneOffset() / -60));			
	}
	
	function callBackend(protocol, hostname, port, path, method, proxy, decode, callback, postData){

		if( port === null && protocol === 'http:')
		{
			port = 80;
		}

		if( port === null && protocol === 'https:')
		{
			port = 443;
		}

		var options = 
		{
			hostname: hostname,
			port: port,
			path: path,
			method: method,
			rejectUnauthorized: false
		};

		if(proxy)
		{
			options = {
				host: "proxy.wdf.sap.corp",
			 	port: 8080,
			 	path: protocol + "//" + hostname + ":" + port + path,
			 	headers: {
			    	Host: hostname
			  	}
			};
		}

		if (local && sso_enable)
		{
			options.pfx = user.SSOCertificate;
			options.passphrase = user.SSOCertificatePassphrase;
		}

		if (method.toLowerCase() === "post" && postData !== undefined) {
			options.headers = {
				'Content-Type': 'text/xml; charset=UTF-8',
				'Content-Length': (postData !== undefined ? postData.length : 0)
			};
		}

		var data = "";
		console.log(method.toUpperCase() + ": " + protocol + "//" + hostname + ":" + port + path);

		var req = {};

		if( protocol === "http:")
		{
			req = http_req.request(options, function(res) {
				res.setEncoding('binary');

				var contentType = res.headers['content-type'];
				if (decode !== "none")
				{ 
					res.setEncoding('binary');
				}
				res.on('data', function(chunk) { data += chunk; });
				res.on('end', function(){
					if (decode === "none"){
						callback( data, contentType );
					}
					else
					{
						callback( iconv.decode(data, decode).toString('utf-8'), contentType);
					}
				});
			});
		}
		else
		{

			req = https_req.request(options, function(res) {
				res.setEncoding('binary');

				var contentType = res.headers['content-type'];
			    res.on('data', function (chunk) {
			        data += chunk;
			    });
			    res.on('end', function () {
			        callback(data, contentType);
			    });
			});
		}
		

		if (method.toLowerCase() === "post" && postData !== undefined) 
		{			
			req.write(postData);
		}

	    req.end();
		req.on('error', function (e) {
		    console.error(e);
		});
	}

	//api to check if client is existing
	app.get('/client', function (request, response) {
		response = setHeader( request, response );			
		response.send('{"client":"true", "os": "' + process.platform + '", "version": "' + webkitClient.version + '"}');
	});

	//generic api call get
	app.get('/api/get', function(request, response) {
		var json = false;
		var proxy = false;

		if (typeof request.query.url === "undefined" || request.query.url === "")
		{
			response = setHeader( request, response );	
			response.send("Paramter url needs to be set!");
			return;
		}

		if (typeof request.query.json !== "undefined" && request.query.json === "true")
		{
			json = true;
			response.setHeader('Content-Type', 'application/json');
		}

		if (typeof request.query.proxy !== "undefined" && request.query.proxy === "true")
		{
			proxy = true;
		}

		var service_url = url.parse(request.query.url);	

		var decode = "none";
		if(typeof request.query.decode !== "undefined")
		{				
			decode = request.query.decode;
		}


		callBackend(service_url.protocol, service_url.hostname, service_url.port, service_url.path, 'GET', proxy, decode, function (data, contentType) {
			response = setHeader( request, response );	
			//console.log(contentType);
			//response.setHeader('Content-Type', contentType);
			response.set({ 'Content-Type': contentType + '; charset=UTF-8'});


			//response.charset = 'UTF-8';
			if (json) {
				try {
					xml2js(data, function (err, result) {
						if (err === undefined) {
							response.send(JSON.stringify(result));
						}
						else {
							response.send("Could not convert XML to JSON.");
						}
					});
				}
				catch(err) {
					response.send("Could not convert XML to JSON.");
				}
			}
			else 
			{
				response.send(data);
			}
		});
	});

	app.get('/api/client/get', function(request, response)
	{
		if (typeof webkitClient !== 'undefined' && webkitClient)
            {                

                webkitClient.jQuery.ajax({
                    url: request.query.url, 
                    type: "GET",                    
                    success: 
                        function(data)
                        {                                        
                            response.send(data);
                        },
                    error: 
                        function() {
                            response.send("error calling " + request.query.url);                            
                        }
                });

            }  
            else response.send("no client");      
	});


	app.get('/api/client/copy', function(request, response)
	{
		if (typeof webkitClient !== 'undefined' && webkitClient)
            {        
            	webkitClient.gui.Clipboard.get().set(request.query.text);        
            	response.send("done");      
            }  
            else response.send("no client");      
	});

	//generic api call post
	app.options("/api/post", function(request, response){
		response = setHeader( request, response );	
		response.send();
		return;
	});

	app.post("/api/post", function (request, response) {
		if (typeof request.query.url === "undefined" || request.query.url === "")
		{
			response = setHeader( request, response );	
			response.send("Paramter url needs to be set!");
			return;
		}

		var service_url = url.parse(request.query.url);	
	    //var postData = request.rawBody;
		var postData = JSON.stringify(request.body);

		callBackend(service_url.protocol, service_url.hostname, service_url.port, service_url.path, "POST", false, "none", function(data) {
			response = setHeader( request, response );		
			response.send(data);
		}, postData);
	}); 


	var concatAttributes = function(array, object, mapFunction)
	{
		for (var attribute in object) {
			if (object.hasOwnProperty(attribute)) 
			{
			 	if(!array[attribute])
				{
				 	array[attribute] = [];
				}
				
				var value = object[attribute];
				if( mapFunction !== undefined )
				{
					value = mapFunction(attribute, value);
				}		

				if( value !== undefined )
				{				
					array[attribute] = array[attribute].concat(value); 				
				}
			}
		}
		return array;
	};

	var loadAppNodeModules = function() {
		findModuleFiles(path.join(__dirname, '../webui/app'), function(modulePath, module) {
			if(module.nodeModules) {
				console.log("found one:" + module);
				for(var i = 0; i < module.nodeModules.length; i++) {
					require(path.join(path.dirname(modulePath), module.nodeModules[i]))(app);
				}
			}
		});
	};

	var findModuleFiles = function(dir, moduleHandler)
	{		
		var files = fs.readdirSync(dir);
		    
		for (var i = 0; i < files.length; i++){	    
		    var name = path.join(dir, '/', files[i]);			    		    

		    if (fs.statSync(name).isDirectory())
		    {		    	
		    	findModuleFiles(name, moduleHandler);		    	    
		    }
		    else
		    {
		    	if (path.basename(name) === '_modules.json')
		    	{
		    		try
		    		{
		    			delete require.cache[require.resolve(name)];
			    		var module = require(name);

						moduleHandler(name, module);	    				   
			    	}
			    	catch(e)
			    	{
			    		console.log(e);
			    	}
		    	}		        
		    }
		}
	};

	var getFiles = function(dir)
	{
		var out_files = {};
		findModuleFiles(dir, function(modulePath, module) {
			out_files = concatAttributes(out_files, module, function(attribute_name, value)
			    		{
			    			if( attribute_name.length > 6 && attribute_name.substring(attribute_name.length - 6) === "_files" )
			    			{								
			    				for (var i = 0; i < value.length; i++)
			    				{
									var filename = path.join(path.dirname(modulePath), value[i]);	
									value[i] = path.relative(path.join(__dirname, '../webui'), filename);	    			
								}
								return value;
			    			} else {
			    				return value;
			    			}
			    		});
		});
		console.log("Printing out files now:\r\n\r\n");
		console.log(out_files);
		return out_files;
	};

	loadAppNodeModules();

	app.get("/api/modules", function (request, response) 
	{
		response = setHeader( request, response );

		//cache module files for etag if existing
		var getResponse = true;		
		if(eTag !== undefined)
		{
			//response.setHeader('Cache-Control', 'no-cache, max-age=2592000');	// 30 days
            response.setHeader('Cache-Control', 'must-revalidate, private');
			response.setHeader('ETag', eTag);
            response.setHeader('Expires', '-1');
			if( request.headers['if-none-match'] === eTag)
			{
				getResponse = false;
			}
		}
		else
		{
			response.setHeader('Expires', '-1');
			//response.header('Cache-Control', 'no-cache, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            response.setHeader('Cache-Control', 'must-revalidate, private');
			response.setHeader('Last-Modified', (new Date()).toUTCString());
			response.removeHeader('Etag');
		}	
		
		//console.log(eTag);
		//console.log(request.headers['if-none-match']);		

		if( getResponse )
		{
		    var files = {};

			var bridge_path = path.join(__dirname, '../webui/bridge');
		    var bridge_files = getFiles(bridge_path);
		    files = concatAttributes(files, bridge_files);

			var app_path = path.join(__dirname, '../webui/app');
		    var app_files = getFiles(app_path);	
		    files = concatAttributes(files, app_files);

		    if (typeof request.query.format === "undefined")
		    {
		    	response.setHeader('Content-Type', 'text/plain;');						    	   
				response.send(JSON.stringify(files));		
			}
			else if( request.query.format === "js")
			{
				var buildify = require('buildify')(path.join(__dirname, '..', '/webui'),{ encoding: 'utf-8', eol: '\n' });			
				buildify.concat(files.js_files);		
				response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
				response.send(buildify.uglify({ mangle: false }).getContent()); //mangle does not work with angular currently		
			}
			else if( request.query.format === "css")
			{
				var buildify = require('buildify')(path.join(__dirname, '..', '/webui'),{ encoding: 'utf-8', eol: '\n' });	
				buildify.concat(files.css_files);				
				response.setHeader('Content-Type', 'text/css; charset=utf-8');
				response.send(buildify.cssmin().getContent());	
			}
		}
		else
		{
			response.send();
		}
	});	

	//ms-exchange calendar data request
	if( local )
	{
		app.get("/api/calDataSSO", function (request, response) {
			response = setHeader( request, response );	
			var json = function () {
				if (typeof request.query.format !== "undefined") {
					return (request.query.format.toLowerCase() === "json") ? true : false;
				}
			}();

			var ews;
			try {
				// we want to have business logic, iff at all in the api.js and not ewsclient.js
				var dateFrom = request.query.dateFrom;
				var dateTo = request.query.dateTo;
				if (dateFrom === undefined || dateTo === undefined) {
					throw new Error("dateFrom_s and dateTo_s must not be undefined.");
				}
				
				if (dateFrom === "" || dateTo === "") {
					throw new Error("dateFrom_s and dateTo_s must not ne empty.");
				}
				
				if (dateFrom.length !== 20 || dateTo.length !== 20) {
					throw new Error("dateFrom_s and dateTo_s must follow the scheme \"YYYY-MM-DDTHH:MM:SSZ\", e.g. \"1789-08-04T23:59:00Z\"");
				}

				ews = new EWSClient("calview", request.query, json);
			} catch (e) {
				var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
				console.log(ans);
				response.send(ans);				
				return;
			}

			ews.doRequest(function (res) {
				if (res instanceof Error) {
					var ans = "EWS-request resulted in an error:\n" + res.toString();
					console.log(ans);
					response.send(ans);
				}
				else {
					if (json) {
						response.setHeader('Content-Type', 'application/json');
					}
					response.send(res);
				}
			});

		});
	
		app.get("/api/calGetItemSSO", function (request, response) {
			response = setHeader( request, response );	
			var json = function () {
				if (typeof request.query.format !== "undefined") {
					return (request.query.format.toLowerCase() === "json") ? true : false;
				}
			}();

			var ews;
			try {
				ews = new EWSClient("getitem", request.query, json);
			} catch (e) {
				var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
				console.log(ans);
				response.send(ans);				
				return;
			}

			ews.doRequest(function (res) {
				if (res instanceof Error) {
					var ans = "EWS-request resulted in an error:\n" + res.toString();
					console.log(ans);
					response.send(ans);
				}
				else {
					if (json) {
						response.setHeader('Content-Type', 'application/json');
					}
					response.send(res);
				}
			});

		});
					
		// delete booked Room
		// Pseudocode:
		// - First we need to termine, given the start and end time the echangeUid and 
		//		the changeKey of the Calender Item in the users (and not the rooms) calendar
		// - Then we get this item with all required, optional and resource-attendees
		// - We compute an update-request which only keeps the attendees which are not 
		//	  the room itself (termined by the Emailaddress of the query)
		// - send this to exchange
		//
		// FIXME: this is currently very linear code and not really easy to read, but 
		//		as proof of concept, this was needed :)
		//		=> needs to be refactored
		//		- Will potentially fail if the user has two appoints in his calendar
		//		  with the same start/end time as the booking of the room. 
		//		  As this is a common case, needs to be fixed prior to release
		app.get("/api/calDeleteBookedRoomSSO", function (request, response) {
			response = setHeader( request, response );	
			var json = function () {
				if (typeof request.query.format !== "undefined") {
					return (request.query.format.toLowerCase() === "json") ? true : false;
				}
			}();

			if (request.query.dateFrom === "" || request.query.dateTo === "" || request.query.eMail === "") {
					throw new Error("dateFrom_s and dateTo_s and eMail must not be empty.");
			}
				
			var ews;
			try {
				// first we need to get the corresponding meeting
				ews = new EWSClient("calview", request.query, true);
			} catch (e) {
				var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
				console.log(ans);
				response.send(ans);				
				return;
			}
			
			var events = {};
			var eventsRaw = {};
			var returnval = ews.doRequest(function (res) {
				if (res instanceof Error) {
					var ans = "EWS-request resulted in an error:\n" + res.toString();
					console.log(ans);
					response.send(ans);
				}
				else {
					if (json) {
						response.setHeader('Content-Type', 'application/json');
					}
					//response.send(res);
					var resj = JSON.parse(res);
					var eventsRaw = resj["m:FindItemResponse"]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];	
					callme(request, response, eventsRaw);
				}
			});
//		});
			
//		
//		app.get("/api/calDeleteBookedRoomSSO2", function (request, response) {
//			response = setHeader( request, response );	
//			var json = function () {
//				if (typeof request.query.format != "undefined") {
//					return (request.query.format.toLowerCase() == "json") ? true : false;
//				}
//			}();
//			callme(request, response)
//		});
		function callme (request, response, eventsRaw) {
					// now we have calview in "res" and can perform the search for the right exchangeUid & all possible Attendees
			var events = [];
		
			
					for (var i = 0; i < eventsRaw.length; i++) {
						
						var exchangeUid = eventsRaw[i]["t:ItemId"][0]["$"]["Id"];
						events.push({
							start: parseEWSDateStringAutoTimeZone(eventsRaw[i]["t:Start"][0]),
							end: parseEWSDateStringAutoTimeZone(eventsRaw[i]["t:End"][0]),
							timeZone: eventsRaw[i]["t:TimeZone"][0],
							exchangeUid: exchangeUid,
							changeKey: eventsRaw[i]["t:ItemId"][0]["$"]["ChangeKey"]
						});
						
						query = request.query;
						query["exchangeUid"] = exchangeUid;
						query["changeKey"] = eventsRaw[i]["t:ItemId"][0]["$"]["ChangeKey"];
						var ews2 = undefined;
						try {
							// first we need to get the corresponding meeting
							ews2 = new EWSClient("getitem", query, true);
						} catch (e) {
							var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
							console.log(ans);
							response.send(ans);				
							return;
						}
						
						var itemsRaw = {};
						ews2.doRequest(function (res) {
							if (res instanceof Error) {
								var ans = "EWS-request resulted in an error:\n" + res.toString();
								console.log(ans);
								response.send(ans);
							}
							else {
								response.setHeader('Content-Type', 'application/json');
								//response.send(res);
								var resj = JSON.parse(res);
								
								// fixme - needs support of multiple items
								var itemsRaw = resj["m:GetItemResponse"]["m:ResponseMessages"][0]["m:GetItemResponseMessage"][0]["m:Items"][0]["t:CalendarItem"][0];
		
								var breakout = true;
								var attendeelist = {};
								["t:RequiredAttendees", "t:OptionalAttendees", "t:Resources"].map(function (at) {
									if ( typeof itemsRaw[at] != "undefined") {
									attendeelist[at] = itemsRaw[at][0]["t:Attendee"].map(function(x) {
										var h = {}; 
										h["EmailAddress"]= x["t:Mailbox"][0]["t:EmailAddress"][0];
										if (h["EmailAddress"] == request.query.eMail) {
											breakout = false;
										}
										h["Name"]= x["t:Mailbox"][0]["t:Name"][0]; 
										h["RoutingType"] = x["t:Mailbox"][0]["t:RoutingType"][0]; 
										return h; 
									});
									}
								});
								if (breakout === true) {
									return;
								}
								query["Attendeelist"] = attendeelist;
								
								// from here on we only have one item
								
								var ews3 = undefined;
						try {
							// first we need to get the corresponding meeting
							ews3 = new EWSClient("updatedattendees", query, true);
						} catch (e) {
							var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
							console.log(ans);
							response.send(ans);				
							return;
						}
						
						
						ews3.doRequest(function (res) {
							if (res instanceof Error) {
								var ans = "EWS-request resulted in an error:\n" + res.toString();
								console.log(ans);
								response.send(ans);
							} else {
								if (json) response.setHeader('Content-Type', 'application/json');
									response.send(res);
							}
						});
							
							}
						});

			
					}
		};
		});

		
//		app.get("/api/calHelloWorldSSO", getEWSFunction("getitem", function(request, response, res) {
//			response.send("alles klar");
//		}));
//			
//	
//			
//			
//		function getEWSFunction(clientType, businesslogicAfterRequest ){
//				return function(request, response){
//				response = setHeader( request, response );	
//				var json = function () {
//					if (typeof request.query.format != "undefined") {
//						return (request.query.format.toLowerCase() == "json") ? true : false;
//					}
//				}();
//
//				if (request.query.dateFrom == "" || request.query.dateTo == "" || request.query.eMail == "") {
//					throw new Error("dateFrom_s and dateTo_s and eMail must not be empty.");
//				}
//				
//				var ews = undefined;
//				try {
//					ews = new EWSClient(clientType, request.query, true);
//				} catch (e) {
//					var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
//					console.log(ans);
//					response.send(ans);				
//					return;
//				}
//			
//				var events = {};
//				var eventsRaw = {};
//				var returnval = ews.doRequest(function (res) {
//					if (res instanceof Error) {
//						var ans = "EWS-request resulted in an error:\n" + res.toString();
//						console.log(ans);
//						response.send(ans);
//					} else {
//						if (json) response.setHeader('Content-Type', 'application/json');
//						
//						businesslogicAfterReqeust(request, response, res);
//						
//					}
//			
//				});
//			};
//		};
//
//		// createmeetingcancelation
//		//
//		// ONLY POC
		//
		app.get("/api/calDelRoomSSO", function (request, response) {
			response = setHeader( request, response );	
			var json = function () {
				if (typeof request.query.format !== "undefined") {
					return (request.query.format.toLowerCase() === "json") ? true : false;
				}
			}();
			var query = request.query;
							
			query["exchangeUid"] = "AAMkADgwNmFiNjZmLWNhMjAtNDM3NC1iNTQwLWRmZGM3M2FjNjIxNgBGAAAAAADXIlUkcRIbRYPjIjd5QW+wBwD9LZwrDBnqSprlNzZ+2syDAAACfSQ1AADItGL/rnEATphNHApMieshAAEvro7CAAA=";
			query["changeKey"]="DwAAABQAAADv9Nm9wQSwRax8OlWgsMuLAAGBSg==";
			
						
			var ews = undefined;
			try {
				ews = new EWSClient("deleteRoom", query, json);
			} catch (e) {
				var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
				console.log(ans);
				response.send(ans);				
				return;
			}

			ews.doRequest(function (res) {
				if (res instanceof Error) {
					var ans = "EWS-request resulted in an error:\n" + res.toString();
					console.log(ans);
					response.send(ans);
				}
				else {
					if (json) response.setHeader('Content-Type', 'application/json');
					response.send(res);
				}
			});

		});



		// createmeetingcancelation
		// This one works, but cancels the complete meeting and currently sends a 
		// non-custumizable text about the weather to all attendees
		//
		// Works only if the changeKey is set on the query!
		// FIXME: either decommit this functionallity 
		app.get("/api/calCreatemeetingcancelationSSO", function (request, response) {
			response = setHeader( request, response );	
			var json = function () {
				if (typeof request.query.format !== "undefined") {
					return (request.query.format.toLowerCase() === "json") ? true : false;
				}
			}();

			var ews = undefined;
			try {
				ews = new EWSClient("createmeetingcancelation", request.query, json);
			} catch (e) {
				var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
				console.log(ans);
				response.send(ans);				
				return;
			}

			ews.doRequest(function (res) {
				if (res instanceof Error) {
					var ans = "EWS-request resulted in an error:\n" + res.toString();
					console.log(ans);
					response.send(ans);
				}
				else {
					if (json) response.setHeader('Content-Type', 'application/json');
					response.send(res);
				}
			});

		});

		
		app.get("/api/calRoomsSSO", function (request, response) {
			response = setHeader( request, response );	
			var json = function () {
				if (typeof request.query.format !== "undefined") {
					return (request.query.format.toLowerCase() === "json") ? true : false;
				}
			}();

			var ews = undefined;
			try {
				ews = new EWSClient("resolvenames", request.query, json);
			} catch (e) {
				var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
				console.log(ans);
				response.send(ans);				
				return;
			}

			ews.doRequest(function (res) {
				if (res instanceof Error) {
					var ans = "EWS-request resulted in an error:\n" + res.toString();
					console.log(ans);
					response.send(ans);
				}
				else {
					if (json) response.setHeader('Content-Type', 'application/json');
					response.send(res);
				}
			});

		});
	}
    
	app.get("/api/trafficLight" , function (request, response) {
		/* 
		traffic light command api parameters:
		turn off (0 is the number 0)
		1 turn on
		R turn on red traffic light
		Y turn on yellow traffic light
		G turn on green traffic light
		O turn off all traffic light
		-# switch when the device consists of multiple switches, choose this one, first=0
		-i nnn interval test, turn the device on and off, time interval nnn ms, in an endless loop
		-I nnn interval test, turn on, wait nnn ms and turn off
		-p t1 .. tn pulse mode, the switch will be turned on for 0.5 seconds then t1 seconds paused, turned on 0.5 s and t2 s pause, etc. after processing the last argument the switch turns off and the program terminates.
		*/
		var colorOn = request.query.color;	
		
		var l_err = '';
		if(process.platform === "win32") {
			var child = execFile('USBswitchCmd.exe', [ colorOn ] , { cwd: pathTrafLight } , function( error, stdout, stderr) {
				// callback function for switch
			   if ( error ) {
					// print error
					console.log(stderr);
					l_err = stderr;
					// error handling & exit
			   }
		   });
		}

		response = setHeader( request, response );			
		response.send('{"msg":"' + l_err + '"}');
	});

/*
	app.get("/api/installModule", function(request, response) {
		if (typeof request.query.npmModule === "undefined" || request.query.npmModule === "")
		{
			response = setHeader( request, response );	
			response.send({success: false, message: "Please specify an npm-module to be installed."});
			return;
		}

		webkitClient.installNpmModule(request.query.npmModule, function(success, message) { response.send({success: success, message: message}); });
	});*/
}
