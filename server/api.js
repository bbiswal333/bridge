var EWS_URI = "https://mymailwdf.global.corp.sap/ews/exchange.asmx";

var https_req	= require('https');
var http_req	= require('http');
var url 		= require('url');
var npm_load	= require('./npm_load.js');
var path		= require('path');

exports.register = function(app, user, local, proxy, npm)
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
			response.setHeader('Access-Control-Allow-Headers', 'X-Requested-Wit, Content-Type, Accept' );
			response.setHeader('Access-Control-Allow-Credentials', 'true' );
			response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS' );
		}    		
		return response;
	};

	function callBackend(protocol, hostname, port, path, method, decode, callback, postData){

		var options = 
		{
			hostname: hostname,
			port: port,
			path: path,
			method: method,
			rejectUnauthorized: false
		};

		if (local)
		{
			options.pfx = user.SSOCertificate;
			options.passphrase = user.SSOCertificatePassphrase;
		}

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
				res.on('data', function(chunk) { data += chunk; });
				res.on('end', function(){ callback(data); });
			});
		}
		

		if (method.toLowerCase() == "post" && postData != undefined) 
		{			
			req.write(postData);
		}

		req.end();
		req.on('error', function(e) {
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

		var service_url = url.parse(request.query.url);	

		var decode = "none";
		if(typeof request.query.decode != "undefined")
		{				
			decode = request.query.decode;
		}


		callBackend(service_url.protocol, service_url.hostname, service_url.port, service_url.path, 'GET', decode, function (data) {
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

	/*app.get('/api/wire', function(request, response) {

		wire().getchatrooms('87873', 0, function(data){
			response.send(data);
		});

	});*/

	//for fetching the rawBody of received POST-requests; Adapted from http://stackoverflow.com/questions/9920208/expressjs-raw-body
	app.use(function(req, res, next) {
	    var data = '';
	    req.setEncoding('utf8');
	    req.on('data', function(chunk) { 
	        data += chunk;
	    });
	    req.on('end', function() {
	        req.rawBody = data;
	        next();
	    });
	});

	//generic api call post
	app.post("/api/post", function (request, response) {
		if (typeof request.query.url == "undefined" || request.query.url == "")
		{
			response = setHeader( request, response );	
			response.send("Paramter url needs to be set!");
			return;
		}

		var service_url = url.parse(request.query.url);	
		var postData = request.rawBody;

		callBackend(service_url.hostname, service_url.port, service_url.path, "POST", "none", function(data) {
			response = setHeader( request, response );		
			response.send(data);
		}, postData);				
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
				ews = new EWSClient(request.query.from, request.query.to, EWS_URI, user, json);
			} catch (e) {
				var ans = "Initialisation of EWSClient resulted in an error:\n" + e.toString();
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
