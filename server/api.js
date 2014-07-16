var https_req	= require('https');
var http_req	= require('http');
var url 		= require('url');
var fs          = require('fs');
var path 		= require('path');
var npm_load	= require('./npm_load.js');
var path		= require('path');

exports.register = function(app, user, local, proxy, npm, eTag)
{
	//get api modules	
	var xml2js 	  	  = require("xml2js").parseString;
	var iconv 	  	  = require("iconv-lite");
	var EWSClient 	  = require("./ews/ewsClient.js").EWSClient;
	var wire          = require("./wire.js");
	var execFile  	  = require('child_process').execFile;
	var pathTrafLight = path.join( __dirname , '\\trafficlight');

	function setHeader(request, response)
	{	
		response.setHeader('Content-Type', 'text/plain');
		var re = /^((https:\/\/)|(http:\/\/)|)([a-zA-Z0-9\.\-]*(\.sap\.corp|\.corp\.sap)|localhost)(:\d+)?($|\/)/;
		if ( request.headers.origin != undefined && re.test(request.headers.origin))
		{
			response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
			response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept' );
			response.setHeader('Access-Control-Allow-Credentials', 'true' );
			response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS' );
		}    		
		return response;
	};

	function callBackend(protocol, hostname, port, path, method, proxy, decode, callback, postData){

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

		/*if (local)
		{
			options.pfx = user.SSOCertificate;
			options.passphrase = user.SSOCertificatePassphrase;
		}*/

		if (method.toLowerCase() == "post" && postData != undefined) {
			options.headers = {
				'Content-Type': 'text/xml; charset=UTF-8',
				'Content-Length': (postData != undefined ? postData.length : 0)
			};
		}

		var data = "";
		console.log(method.toUpperCase() + ": " + protocol + "//" + hostname + ":" + port + path);

		var req = {};

		if( protocol == "http:")
		{
			req = http_req.request(options, function(res) {
				if (decode != "none")
				{ 
					res.setEncoding('binary');
				}
				res.on('data', function(chunk) { data += chunk; });
				res.on('end', function(){
					if (decode == "none"){
						callback( data );
					}
					else
					{
						callback( iconv.decode(data, decode).toString('utf-8') );
					}
				});
			});
		}
		else
		{

			req = https_req.request(options, function(res) {
			    res.on('data', function (chunk) {
			        data += chunk;
			    });
			    res.on('end', function () {
			        callback(data);
			    });
			});
		}
		

		if (method.toLowerCase() == "post" && postData != undefined) 
		{			
			req.write(postData);
		}

	    req.end();
		req.on('error', function (e) {
		    console.error(e);
		});
	};

	//api to check if client is existing
	app.get('/client', function (request, response) {
		response = setHeader( request, response );			
		response.send('{"client":"true"}');
	});

	//generic api call get
	app.get('/api/get', function(request, response) {
		var json = false;
		var proxy = false;

		if (typeof request.query.url == "undefined" || request.query.url == "")
		{
			response = setHeader( request, response );	
			response.send("Paramter url needs to be set!");
			return;
		}

		if (typeof request.query.json != "undefined" && request.query.json == "true")
		{
			json = true;
			response.setHeader('Content-Type', 'application/json');
		}

		if (typeof request.query.proxy != "undefined" && request.query.proxy == "true")
		{
			proxy = true;
		}

		var service_url = url.parse(request.query.url);	

		var decode = "none";
		if(typeof request.query.decode != "undefined")
		{				
			decode = request.query.decode;
		}


		callBackend(service_url.protocol, service_url.hostname, service_url.port, service_url.path, 'GET', proxy, decode, function (data) {
			response = setHeader( request, response );	
			response.charset = 'UTF-8';
			if (json) {
				try {
					xml2js(data, function (err, result) {
						if (err == undefined) {
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
			else {
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

	//generic api call post
	app.options("/api/post", function(request, response){
		response = setHeader( request, response );	
		response.send();
		return;
	});

	app.post("/api/post", function (request, response) {
		if (typeof request.query.url == "undefined" || request.query.url == "")
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
	}

	var getFiles = function(dir, files)
	{		
		    
		var files = fs.readdirSync(dir);	    
		var out_files = {};
		    
		for (var i = 0; i < files.length; i++){	    
		    var name = path.join(dir, '/', files[i]);			    		    

		    if (fs.statSync(name).isDirectory())
		    {		    	
		    	out_files = concatAttributes(out_files, getFiles(name));		    	    
		    }
		    else
		    {
		    	if (path.basename(name) == '_modules.json')
		    	{
		    		try
		    		{
		    			delete require.cache[require.resolve(name)];
			    		var module = require(name);

			    		out_files = concatAttributes(out_files, module, function(attribute_name, value)
			    		{
			    			if( attribute_name.length > 6 && attribute_name.substring(attribute_name.length - 6) == "_files" )
			    			{								
			    				for (var i = 0; i < value.length; i++)
			    				{
									var filename = path.join(path.dirname(name), value[i]);	
									value[i] = path.relative(path.join(__dirname, '../webui'), filename);	    			
								}
								return value;
			    			}	
			    			else return value;		    			
			    		});	    				   
			    	}
			    	catch(e)
			    	{
			    		console.log(e);
			    	}
		    	}		        
		    }
		}	    
		return out_files;
	}

	app.get("/api/modules", function (request, response) 
	{
		response = setHeader( request, response );

		//cache module files for etag if existing
		var getResponse = true;		
		if(eTag !== undefined)
		{
			response.setHeader('Cache-Control', 'public, max-age=2592000');	// 30 days		
			response.setHeader('ETag', eTag);		
			if( request.headers['if-none-match'] == eTag)
			{
				getResponse = false;
			}
		}
		else
		{
			response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
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

		    if (typeof request.query.format == "undefined")
		    {
		    	response.setHeader('Content-Type', 'text/plain;');						    	   
				response.send(JSON.stringify(files));		
			}
			else if( request.query.format == "js")
			{
				var buildify = require('buildify')(path.join(__dirname, '..', '/webui'),{ encoding: 'utf-8', eol: '\n' });			
				buildify.concat(files.js_files);		
				response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
				response.send(buildify.uglify({ mangle: false }).getContent()); //mangle does not work with angular currently		
			}
			else if( request.query.format == "css")
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
				if (typeof request.query.format != "undefined") {
					return (request.query.format.toLowerCase() == "json") ? true : false;
				}
			}();

			var ews = undefined;
			try {
				ews = new EWSClient(request.query.from, request.query.to, json);
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
		if(process.platform == "win32") {
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
}
