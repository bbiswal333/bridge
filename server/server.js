var EWS_URI = "https://mymailwdf.global.corp.sap/ews/exchange.asmx";

var https_req	= require('https');
var http_req	= require('http');
var http		= require('http');
var path        = require('path');
var url         = require('url');
var exec        = require('child_process').exec;
var sso 		= require('./sso.js');
var EWSClient 	= {};
var express 	= {};
var xml2js = {};
var iconv = {};

var launch = function(npm)
{
	//get express via npm install
	try{
		express = require('express');
		xml2js = require('xml2js').parseString;
		iconv = require('iconv-lite');
		EWSClient = require("./ews/ewsClient.js").EWSClient;
		run();
	}
	catch(err){
		var server_path = path.join(__dirname, '/');
		console.log("downloading npm package dependencies..")
		
		var set_proxy = "";
		if(process.platform == "win32") {
			set_proxy = "set http_proxy http_proxy=http://proxy:8080 && set https_proxy=http://proxy:8080 && ";
		}
		else {
			set_proxy = "export http_proxy http_proxy=http://proxy:8080 && export https_proxy=http://proxy:8080 && ";
		}
		exec(set_proxy + "cd " + server_path + ' && ' + npm + ' install', function (error, stdout, stderr) {
			console.log(stderr);
			console.log("npm packages installed..");
			express = require('express');
			xml2js = require('xml2js').parseString;
			iconv = require('iconv-lite');
			EWSClient = require("./ews/ewsClient.js").EWSClient;			
			run();
		});
	}

	//run server with sso handling
	function run(){
		sso.execute( function(user)
		{
			var app = express();

			//serve static files in webui folder as http server
			var webui_path = path.join(__dirname, '../', '/webui');
			app.use('/', express.static(webui_path));

			//For fetching the rawBody of received POST-requests; Adapted from http://stackoverflow.com/questions/9920208/expressjs-raw-body
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

			//call backends with client certificate
			function callBackend(protocol, hostname, port, path, method, decode, callback, postData){
				var options = {
					hostname: hostname,
					port: port,
					path: path,
					method: method,
					pfx: user.SSOCertificate,
					passphrase: user.SSOCertificatePassphrase,
					rejectUnauthorized: false
				};

				if (method.toLowerCase() == "post" && postData != undefined) {
					options.headers = {
						'Content-Type': 'text/xml; charset=UTF-8',
						'Content-Length': (postData != undefined ? postData.length : 0)
					};
				}

				var data = "";

				//for testing purposes
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

				if (method.toLowerCase() == "post" && postData != undefined) {
					//console.log(postData);
					req.write(postData);
				}

				req.end();
				req.on('error', function(e) {
					console.error(e);
				});
			}

			//generic api call GET
			app.get('/api/get', function(request, response) {
				var json = false;

				if (typeof request.query.url == "undefined" || request.query.url == "") {
					response.setHeader('Content-Type', 'text/plain');	
					response.send("Paramter url needs to be set!");
					return;
				}

				if (typeof request.query.json != "undefined" && request.query.json == "true") {
					json = true;
				}

				var service_url = url.parse(request.query.url);	
				
				var decode = "none";
				if(typeof request.query.decode != "undefined")
				{				
					decode = request.query.decode;
				}

							
				callBackend(service_url.protocol, service_url.hostname, service_url.port, service_url.path, 'GET', decode, function (data) {
					//console.log(data);
					response.setHeader('Content-Type', 'text/plain');
	  				response.charset = 'UTF-8';
					if (json) {
						xml2js(data, function (err, result) {
							if (err == undefined) {
								response.send(JSON.stringify(result));
							}
							else {
								response.send("Could not convert XML to JSON.");
							}
						});
					}
					else {
						response.send(data);
					}
				});
			});

			//generic api call POST
			app.post("/api/post", function (request, response) {
				if (typeof request.query.url == "undefined" || request.query.url == "") {
					response.setHeader('Content-Type', 'text/plain');	
					response.send("Paramter url needs to be set!");
					return;
				}

				var service_url = url.parse(request.query.url);	
				var postData = request.rawBody;

				callBackend(service_url.hostname, service_url.port, service_url.path, "POST", "none", function(data) {
					console.log("Daten: " + data);
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				}, postData);				
			}); 

			//ms-exchange calendar data request
			app.get("/api/calDataSSO", function (request, response) {
				response.setHeader('Content-Type', 'text/plain');
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
						response.send(res);
					}
				});
			
			});

			//create local server
			var port = 8000;
			if (process.argv.length > 2) {
				if (!isNaN(process.argv[2])) {
					port = process.argv[2];
				}
			}

			http.createServer(app).listen(port, "localhost");
			console.log("Bridge Server running at http://localhost:" + port);

			process.on('uncaughtException', function (error) {
			  	var s = new String(error.stack);
			   	if (s.search(/EADDRINUSE/) > -1) {
			   		//Error due to already used address
			   		console.log("It seems like the Bridge server is already running. Please check this or run bridge using a different port.");
			   	}
			   	else {
			   		console.log(error.stack);
			   	}
			});
		});
	}
}

//run and export module
exports.run = launch;
if(require.main === module) { launch('npm'); }
