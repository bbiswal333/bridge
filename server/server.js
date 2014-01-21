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

			//messages subscriptions
			app.get('/api/css/message_subscriptions', function(request, response){
				callBackend('css.wdf.sap.corp', 443, '/sap/bc/devdb/MYMSGSUBSCR?format=json', 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});

			//internal messages
			app.get('/api/css/internal_messages', function(request, response){
				callBackend('css.wdf.sap.corp', 443, '/sap/bc/devdb/MYINTERNALMESS?format=json', 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});

			//it support messages
			app.get('/api/css/it_support', function(request, response){
				callBackend('css.wdf.sap.corp', 443, '/sap/bc/devdb/MYITSUPPORTMESS?format=json', 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});

			//customer messages
			app.get('/api/css/customer_messages', function(request, response){
				callBackend('css.wdf.sap.corp', 443, '/sap/bc/devdb/MYCUSTOMERMESS?format=json', 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});

			//messages details
			app.get('/api/css/message_details', function(request, response){
				callBackend('css.wdf.sap.corp', 443, '/sap/bc/devdb/CUSTMESSDETAILS?CSINSTA=' + request.query.installation + '&MNUMM=' + request.query.number + '&MYEAR=' + request.query.year , 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});

			//employees
			app.get('/api/employee', function(request, response){
				callBackend('ifp.wdf.sap.corp', 443, '/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=' + request.query.maxrow + '&query=' + encodeURI(request.query.query), 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});


			//atc data
			app.get('/api/atc', function(request, response){
				callBackend('ifd.wdf.sap.corp', 443, '/sap/bc/devdb/STAT_CHK_RES_CN?query=' + request.query.query + '&count_prios=' + request.query.count_prios + '&format=json', 'GET', function(data){
					response.setHeader('Content-Type', 'text/plain');	
					response.send(data);
				});
			});
			app.get('/api/atcdetails', function (request, response) {
			    callBackend('ifd.wdf.sap.corp', 443, '/sap/bc/devdb/STAT_CHK_RESULT?query=' + request.query.query + '&format=json', 'GET', function (data) {
			        response.setHeader('Content-Type', 'text/plain');
			        response.send(data);
			    });
			});

			//jira
			app.get('/api/jira', function(request, response){
				//callBackend('sapjira.wdf.sap.corp', 443, '/rest/api/latest/search?jql=' + encodeURI(request.query.jql) + '&expand=renderedFields', 'GET', function(data){
				callBackend('sapjira.wdf.sap.corp', 443, '/rest/api/latest/search?jql=' + encodeURI(request.query.jql), 'GET', function(data){
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



