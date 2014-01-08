var express		= require('express');
var https		= require('https');
var http		= require('http');
var app			= express();
var	fs			= require('fs');
var exec		= require('child_process').exec;
var path        = require("path");
var SSOCertificatePassphrase = Math.random().toString(36).substring(2);
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
	    exec("certutil -f -user -p " + SSOCertificatePassphrase + " -exportPFX " + serialNumber + " \"" + SSOCertificatePath + "\"", function (error, stdout, stderr) {
	        SSOCertificate = fs.readFileSync(SSOCertificatePath);
	        var deleteCommand = 'del "' + SSOCertificatePath + '"';
	        exec(deleteCommand, function (error, stdout, stderr) { });
	    });
	});
} else if(process.platform == "darwin") {

	var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
	var SSOPemPath = path.join(__dirname, '/SSOCert.pem');
	var SSOKeyPath = path.join(__dirname, '/SSOCert.key');
	var SSOCertPath = path.join(__dirname, '/SSOCert.cert');
	SSOCertificatePassphrase = 'test123';
	
	//export complete keychain because security command does not allow to export single identity
    exec("security export -k login.keychain -t identities -P '" + SSOCertificatePassphrase + "' -o '" + SSOCertificatePath+ "' -f pkcs12", function(error, stdout, stderr) {
	       	
    		//convert pfx to pem
    		exec("openssl pkcs12 -in '" + SSOCertificatePath + "' -out '" + SSOPemPath + "' -passin pass:" + SSOCertificatePassphrase + " -passout pass:" + SSOCertificatePassphrase, function(error, stdout, stderr) {
    			
    			var pemBags = [];
    			var bag = {};

    			fs.readFileSync(SSOPemPath).toString().split('\n').forEach(function (pemLine) { 
    				
    				if (pemLine  === 'Bag Attributes')
    				{
    					bag = {};
    					bag.data = "";
    				}

    				bag.data += pemLine;
    				bag.data += '\n';

    				if (pemLine.indexOf("friendlyName: ") != -1)
    				{
    					bag.friendlyName = pemLine.substring(pemLine.indexOf("friendlyName: ") + "friendlyName: ".length);
    				}

    				if (pemLine.indexOf("localKeyID: ") != -1)
    				{
    					bag.localKeyID = pemLine.substring(pemLine.indexOf("localKeyID: ") + "localKeyID: ".length);
    				}

    				if (pemLine.indexOf("subject=") != -1)
    				{
    					bag.subject = pemLine.substring(pemLine.indexOf("subject=") + "subject=".length);
    				}

    				if (pemLine.indexOf("issuer=") != -1)
    				{
    					bag.issuer = pemLine.substring(pemLine.indexOf("issuer=") + "issuer=".length);
    				}

    				if(pemLine.indexOf("-----BEGIN CERTIFICATE-----") != -1)
    				{
    					bag.type = "certificate";
    				}

    				if(pemLine.indexOf("-----BEGIN RSA PRIVATE KEY-----") != -1)
    				{
    					bag.type = "private key";
    				}

    				if(bag.type === "certificate" || bag.type === "private key")
    				{

    					if (pemLine.indexOf("-----END") != -1)
    					{
    						pemBags.push(bag);
    					}
    				}

    			});

				var cert_bag = {};
				var key_bag = {};

    			for (var i = 0; i < pemBags.length; i++) {
    				if( pemBags[i].type === "certificate" && pemBags[i].issuer.indexOf("SSO_CA") != -1 )


    				{
    					cert_bag = pemBags[i];
    				}
    			}


    			for (var i = 0; i < pemBags.length; i++) {
    				if( pemBags[i].type === "private key"  && pemBags[i].localKeyID === cert_bag.localKeyID )
    				{
    					key_bag = pemBags[i];
    				}
    			}

    			//write key and cert file for SSO_CA
    			fs.writeFile(SSOCertPath, cert_bag.data, function(err) {
    				if(err) { console.log(err); } 
    			});

    			fs.writeFile(SSOKeyPath, key_bag.data, function(err) {
    				if(err) { console.log(err); } 
    			});

    			exec("openssl pkcs12 -export -out '" + SSOCertificatePath + "' -inkey '" + SSOKeyPath + 
    		      "' -in '" + SSOCertPath+ "'" + " -passin pass:" + SSOCertificatePassphrase + " -passout pass:" + SSOCertificatePassphrase, function(error, stdout, stderr) {

					SSOCertificate = fs.readFileSync(SSOCertificatePath);
	        		var deleteCommand = 'rm "' + SSOCertificatePath + '"';
					exec(deleteCommand, function (error, stdout, stderr) { });	

					var deleteCommand = 'rm "' + SSOPemPath + '"';
					exec(deleteCommand, function (error, stdout, stderr) { }); 

					var deleteCommand = 'rm "' + SSOKeyPath + '"';
					exec(deleteCommand, function (error, stdout, stderr) { });	

					var deleteCommand = 'rm "' + SSOCertPath + '"';
					exec(deleteCommand, function (error, stdout, stderr) { });	   
    		    });

    		} );
	});
}

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
