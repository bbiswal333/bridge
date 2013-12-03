var express		= require('express');
var https		= require('https');
var http		= require('http');
var app			= express();
var	fs			= require('fs');
var exec		= require('child_process').exec;

var cert = require('./cert');

//serve static files in webui folder as http server
app.use('/', express.static('webui'));


//get certificate
app.get('/api/certificate', function(request, response){

	console.log('Running on: ' + process.platform);
	
    //for windows use certutil to get client certificate
    //for mac os use ???
    //for linux use ???
	var callback = function(err, stdout, stderr){
		console.log(stdout);

		//get serial number with issuer = CN=SSO_CA by parsing stdout
		//create pfx file
		//certutil -f -user -p password -exportPFX serial file.pfx
	};
				
	var execStatement = 'certutil -store -user -v my';
	exec(execStatement, callback);	

});


//internal messages
app.get('/api/css', function(request, response){

	console.log(cert.certificate);
	console.log(cert.passphrase);

	var options = {
		hostname: 'cid.wdf.sap.corp',
		port: 443,
		path: '/sap/bc/devdb/MYINTERNALMESS?format=json',
		method: 'GET',
		pfx: cert.certificate,//fs.readFileSync('server/test.pfx'),
		passphrase: cert.passphrase,//passphrase : password
		rejectUnauthorized: false
	};


	var req = https.request(options, function(res) {
		//response.setHeader('Content-Type', 'test/html');
			response.setHeader('Content-Type', 'text/plain');

		res.on('data', function(d) {
		//	response.send(d);
			response.setHeader('Content-Length', d.length);
			response.end(d);
		});
	});

	req.end();

	req.on('error', function(e) {
		console.error(e);		
		response.send(e);
	});

});

//employees
app.get('/api/employee', function(request, response){


	var options = {
		hostname: 'ifd.wdf.sap.corp',
		port: 443,
		path: '/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=' + request.query.maxrow + '&query=' + request.query.query,
		method: 'GET',
		pfx: fs.readFileSync('server/test.pfx'),
		//passphrase : password
		rejectUnauthorized: false
	};


	var req = https.request(options, function(res) {
		//response.setHeader('Content-Type', 'test/html');
			response.setHeader('Content-Type', 'text/plain');

		res.on('data', function(d) {
		//	response.send(d);
			response.setHeader('Content-Length', d.length);
			response.end(d);
		});
	});

	req.end();

	req.on('error', function(e) {
		console.error(e);		
		response.send(e);
	});

});


//atc data
app.get('/api/atc', function(request, response){


	var options = {
		hostname: 'ifd.wdf.sap.corp',
		port: 443,
		path: '/sap/bc/devdb/STAT_CHK_RES_CN?query=' + request.query.query + '&count_prios=' + request.query.count_prios + '&format=json',
		method: 'GET',
		pfx: fs.readFileSync('server/test.pfx'),
		//passphrase : password
		rejectUnauthorized: false
	};


	var req = https.request(options, function(res) {
		//response.setHeader('Content-Type', 'test/html');
			response.setHeader('Content-Type', 'text/plain');

		res.on('data', function(d) {
		//	response.send(d);
			response.setHeader('Content-Length', d.length);
			response.end(d);
		});
	});

	req.end();

	req.on('error', function(e) {
		console.error(e);		
		response.send(e);
	});

});

//create local server
http.createServer(app).listen(80);



