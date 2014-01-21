var https		= require('https');
var http		= require('http');
var path        = require('path');
var url         = require('url');
var exec        = require('child_process').exec;
var sso 		= require('./sso.js');
var fs 			= require("fs");
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
				const SOAP_TEMPLATE_FILE = "ews/exchange_soap_template.txt";
				const PARAM_NAME_FROM = "from";
				const PARAM_NAME_TO = "to";
				const PLACEHOLDER_FROM = "%DATEFROM%";
				const PLACEHOLDER_TO = "%DATETO%";

				var dateFrom = "";
				var dateTo = "";

				try {
					dateFrom = request.query[PARAM_NAME_FROM];
					dateTo = request.query[PARAM_NAME_TO];

					if (dateFrom == undefined || dateTo == undefined) {
						throw "empty";
					}
				} catch (e) {
					response.send("Parameters not (correctly) stated.");
					return;
				}

				function readSoapTemplate(callback_fn) {
					var readStream = fs.createReadStream(SOAP_TEMPLATE_FILE);
					var data = "";

					readStream.setEncoding('utf8');
					readStream.on('data', function(chunk) {
					  	data += chunk;
					});
					readStream.on("end", function() {
						callback_fn(data);
					});
				}

				function getDataFromExchange_Win(soapString_s, callback_fn) {
					//Create temporay file for soap-query
					var filename = "soap_tmp/" + generateUniqueFileName();
					fs.writeFile(filename, soapString_s, function (err) {
						if (err) {
							console.log(err);
						}
						else {
							callExchange(filename);
						}
					});

					function callExchange(soapFile_s) {
						var data = "";
						var cmd = curlPath + ' -d @' + soapFile_s + ' --insecure -H "Content-Type: text/xml; charset=utf-8" --ntlm -u : https://mymailwdf.global.corp.sap/ews/exchange.asmx > ' + soapFile_s + "_answer";

						exec(cmd, function (error, stdout, stderr) {
							//Read output file of curl
							var readStream = fs.createReadStream(soapFile_s + "_answer");
							

							readStream.setEncoding('utf8');
							readStream.on('data', function(chunk) {
							  	data += chunk;
							});
							readStream.on("end", function() {
								//Delete temporary file
								fs.unlinkSync(soapFile_s);
								fs.unlinkSync(soapFile_s + "_answer");

								callback_fn(data);
							});
						});		
					}

					function generateUniqueFileName() {
						var name = "";

						do {
							name = new Date().getTime() + "_" + Math.round(Math.random() * 100);
						} while (fs.existsSync("soap_tmp/" + name));

						return name;
					}
				}

				function getDataFromExchange_Mac(soapString_s, callback_fn) {
					var userd = user.id.toLowerCase();
					console.log(userd);	

					var auth = new Buffer('SAP_ALL\\' + user.id + ':' + user.pass).toString('base64');
					var ews_url = url.parse("https://mymailwdf.global.corp.sap:443/ews/exchange.asmx");

					console.log(auth);

					var options = {
						hostname: ews_url.hostname,
						port: ews_url.port,
						path: ews_url.path,
						method: "POST",
						pfx: user.SSOCertificate,
						passphrase: user.SSOCertificatePassphrase,
						rejectUnauthorized: false,
						headers: 	{
							"Authorization" : "Basic " + auth,
							'Content-Type': 'text/xml; charset=UTF-8',
		    				'Content-Length': (soapString_s != undefined ? soapString_s.length : 0)
						}
					};	

					console.log(options);		

					var data = "";

					var req = https.request(options, function(res) {
						res.on('data', function(chunk) { 
							data += chunk;
						});
						res.on('end', function() {
							if (data == "") {
								console.log(res.headers);
								
								callback_fn("Seems your credentials were wrong. Please try again!");
							}
							else {
								callback_fn(data);
							}
						});
					});

					if (soapString_s != undefined) {
						req.write(soapString_s);
					}
					req.end();
					req.on('error', function(e) {
						console.error(e);
						callback_fn("An error occured during request to Exchange server.");
					});							
				}


				readSoapTemplate(function (data) {
					data = data.replace(PLACEHOLDER_FROM, dateFrom);
					data = data.replace(PLACEHOLDER_TO, dateTo);

					if (process.platform == "win32") {
						//Windows strategy: Writing SOAP in file, calling cURL with this file as parameter, let cURL write its output to temporary file, then read in this temporary file and send its content back to the user
						getDataFromExchange_Win(data, function (ews_xml) {
							response.setHeader('Content-Type', 'text/plain');
							response.send(ews_xml);
						});
					}
					else {
						getDataFromExchange_Mac(data, function (ews_xml) {
							response.setHeader('Content-Type', 'text/plain');
							response.send(ews_xml);
						});						
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



