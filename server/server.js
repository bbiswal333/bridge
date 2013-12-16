var express		= require('express');
var https		= require('https');
var http		= require('http');
var app			= express();
var	fs			= require('fs');
var exec		= require('child_process').exec;
var path        = require("path");
var SSOCertificatePassphrase = 'test';//Math.random().toString(36).substring(2);
var SSOCertificate = null;

function getSSOCertSerialNumber(error, stdout, stderr) {
    var SSOCertificateFound = false;
    var SSOCertificateValid = false;
    var serialNumberSearchString = "Serial Number: ";
    var issuerSearchString = "CN=SSO_CA";
    var notAfterSearchString = "NotAfter: ";
    var serialNumber = "";

    var allLines = stdout.split("\n");
    if (allLines != null) {
        for (var i = 0; i < allLines.length; i++) {
            if (allLines[i].indexOf(serialNumberSearchString) != -1) {
                serialNumber = allLines[i].substring(allLines[i].indexOf(serialNumberSearchString) + serialNumberSearchString.length);
                SSOCertificateFound = false;
                SSOCertificateValid = false;
            }
            if (allLines[i].indexOf(issuerSearchString) != -1) {
                SSOCertificateFound = true;
            }
            if (allLines[i].indexOf(notAfterSearchString) != -1) {
                var notAfterDate = new Date(allLines[i].substring(allLines[i].indexOf(notAfterSearchString) + notAfterSearchString.length));
                if (notAfterDate > new Date())
                    SSOCertificateValid = true;
            }

            if (SSOCertificateFound && SSOCertificateValid)
                return serialNumber;
        }
    }
};

if(process.platform == "win32") {
	exec("certutil -store -user -v my", function (error, stdout, stderr) {
	    var serialNumber = getSSOCertSerialNumber(error, stdout, stderr);
	    var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
	    console.log("Serial Number: " + serialNumber);
	    console.log("Passphrase: " + SSOCertificatePassphrase);
	    console.log("Path :" + __dirname);
	    exec("certutil -f -user -p " + SSOCertificatePassphrase + " -exportPFX " + serialNumber + " \"" + SSOCertificatePath + "\"", function (error, stdout, stderr) {
	        SSOCertificate = fs.readFileSync(SSOCertificatePath);
	        var deleteCommand = 'del "' + SSOCertificatePath + '"';
	        exec(deleteCommand, function (error, stdout, stderr) {
	            console.log(deleteCommand);
	        });;
	    });
	});
} else if(process.platform == "darwin") {

	var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
    exec("security export -t identities -P '" + SSOCertificatePassphrase + "' -o '" + SSOCertificatePath+ "' -f pkcs12", function(error, stdout, stderr) {
	       	SSOCertificate = fs.readFileSync(SSOCertificatePath);
	       	console.log(SSOCertificate);
	        var deleteCommand = 'rm "' + SSOCertificatePath + '"';
	        //exec(deleteCommand, function (error, stdout, stderr) {
	        //    console.log(deleteCommand);
	        //});;
	});
}


//serve static files in webui folder as http server
var webui_path = path.join(__dirname, '../', '/webui');
app.use('/', express.static(webui_path));

//call backends with client certificate
function callBackend(hostname, port, path, method, callback){
	console.log(SSOCertificate);
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
	
	console.log(options);
	
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

//jira
app.get('/api/jira', function(request, response){
	callBackend('sapjira.wdf.sap.corp', 443, '/rest/api/latest/search?jql=' + encodeURI(request.query.jql) + '&expand=renderedFields', 'GET', function(data){
		response.setHeader('Content-Type', 'text/plain');	
		response.send(data);
	});
});

//create local server
http.createServer(app).listen(8000);



