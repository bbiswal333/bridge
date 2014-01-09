var express		= require('express');
var https		= require('https');
var http		= require('http');
var path        = require('path');
var sso 		= require('./sso.js');

sso.execute( function(SSOCertificatePassphrase, SSOCertificate)
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
			pfx: SSOCertificate,
			passphrase: SSOCertificatePassphrase,
			rejectUnauthorized: false
		};

		var data = "";

		//for testing purposes
		//console.log("https://" + hostname + ":" + port + path);
		
		var req = https.request(options, function(res) {
			res.on('data', function(chunk) { data += chunk; });
			res.on('end', function(){ callback(data); });
		});

		req.end();
		req.on('error', function(e) {
			console.error(e);
		});
	}

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
		callBackend('sapjira.wdf.sap.corp', 443, '/rest/api/latest/search?jql=' + encodeURI(request.query.jql) + '&expand=renderedFields', 'GET', function(data){
			response.setHeader('Content-Type', 'text/plain');	
			response.send(data);
		});
	});

	//create local server
	http.createServer(app).listen(8000);
	exports.app = app;
});
