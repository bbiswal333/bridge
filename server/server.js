var express		= require('express');
var https		= require('https');
var http		= require('http');
var app			= express();
var	fs			= require('fs');
var exec		= require('child_process').exec;

//set user certificate and passphrase
var user_certificate = require( __dirname + '/user_certificate.json');
var certificate = fs.readFileSync( __dirname + '/' + user_certificate.certificate_file);
var passphrase = user_certificate.certificate_passphrase;

//serve static files in webui folder as http server
app.use('/', express.static('webui'));

//call backends with client certificate
function callBackend(hostname, port, path, method, callback){
	var options = {
		hostname: hostname,
		port: port,
		path: path,
		method: method,
		pfx: certificate,
		passphrase: passphrase,
		rejectUnauthorized: false
	};

	var data = "";
	var req = https.request(options, function(res) {
		res.on('data', function(chunk) { data += chunk; });
		res.on('end', function(){ callback(data); });
	});

	req.end();
	req.on('error', function(e) {
		console.error(e);
	});
}

//internal messages
app.get('/api/css', function(request, response){
	callBackend('cid.wdf.sap.corp', 443, '/sap/bc/devdb/MYINTERNALMESS?format=json', 'GET', function(data){
		response.setHeader('Content-Type', 'text/plain');	
		response.send(data);
	});
});

//employees
app.get('/api/employee', function(request, response){
	callBackend('ifd.wdf.sap.corp', 443, '/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=' + request.query.maxrow + '&query=' + request.query.query, 'GET', function(data){
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

//create local server
http.createServer(app).listen(8000);



