var express		= require('express');
var https		= require('https');
var http		= require('http');
var app			= express();
var	fs			= require('fs');
var exec		= require('child_process').exec;

//serve static files in webui folder as http server
app.use('/', express.static('../webui'));

//provide css api
app.get('/api/css', function(request, response){


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

	var options = {
		hostname: 'cid.wdf.sap.corp',
		port: 443,
		path: '/sap/bc/devdb/MYINTERNALMESS?format=json',
		method: 'GET',
		pfx: fs.readFileSync('test.pfx'),
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


http.createServer(app).listen(80);
