const EWS_URI = "https://mymailwdf.global.corp.sap/ews/exchange.asmx";

var https		= require('https');
var http		= require('http');
var path        = require('path');
var url         = require('url');
var exec        = require('child_process').exec;
var sso 		= require('./sso.js');
var EWSClient 	= require("./ews/ewsClient.js").EWSClient;
var express 	= {};

var launch = function()
{
	//get express via npm install
	try{
		express = require('express');
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
		exec(set_proxy + "cd " + server_path + ' && npm install', function (error, stdout, stderr) {
			console.log("npm packages installed..");
			express = require('express');
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

			//call backends with client certificate
			function callBackend(hostname, port, path, method, callback){
				var options = {
					hostname: hostname,
					port: port,
					path: path,
					method: method,
					pfx: user.SSOCertificate,
					passphrase: user.SSOCertificatePassphrase,
					rejectUnauthorized: false
				};

				var data = "";

				//for testing purposes
				console.log("https://" + hostname + ":" + port + path);
				
				var req = https.request(options, function(res) {
					res.on('data', function(chunk) { data += chunk; });
					res.on('end', function(){ callback(data); });
				});

				req.end();
				req.on('error', function(e) {
					console.error(e);
				});
			}

			//geric api call
			app.get('/api/get', function(request, response){
				var service_url = url.parse(request.query.url);				
				callBackend(service_url.hostname, service_url.port, service_url.path, 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});

			//ms-exchange calendar data request
			app.get("/api/calDataSSO", function (request, response) {
				response.setHeader('Content-Type', 'text/plain');

				var ews = undefined;
				try {
					ews = new EWSClient(request.query.from, request.query.to, EWS_URI, user);
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
			http.createServer(app).listen(8000);
			console.log("Bridge Server running at http://localhost:8000.")
		});
	}
}

//run and export module
exports.run = launch;
if(require.main === module) { launch(); }



