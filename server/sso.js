var fs           = require('fs');
var path         = require('path');
var exec         = require('child_process').exec;

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

function getPemBags(fileContent){

    var bag = {};
    var pemBags = [];

    fileContent.split('\n').forEach(function (pemLine) { 
                        
        if (pemLine  === 'Bag Attributes')
        {
            bag = {};
            bag.data = "";
        }

        bag.data += pemLine + '\n';

        if (pemLine.indexOf("localKeyID: ") != -1)
        {
            bag.localKeyID = pemLine.substring(pemLine.indexOf("localKeyID: ") + "localKeyID: ".length);
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

    return pemBags;
}

function runWithPassphrase(SSOCertificatePassphrase, callback)
{
    if(process.platform == "win32") {
    	exec("certutil -store -user -v my", function (error, stdout, stderr) {
    	    var serialNumber = getSSOCertSerialNumber(error, stdout, stderr);
    	    var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
    	    exec("certutil -f -user -p " + SSOCertificatePassphrase + " -exportPFX " + serialNumber + " \"" + SSOCertificatePath + "\"", function (error, stdout, stderr) {
    	        var SSOCertificate = fs.readFileSync(SSOCertificatePath);
    	        var deleteCommand = 'del "' + SSOCertificatePath + '"';
    	        exec(deleteCommand, function (error, stdout, stderr) { });
                callback(SSOCertificatePassphrase, SSOCertificate);
    	    });
    	});
    } else if(process.platform == "darwin") {
    	var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
    	var SSOPemPath = path.join(__dirname, '/SSOCert.pem');
    	var SSOKeyPath = path.join(__dirname, '/SSOCert.key');
    	var SSOCertPath = path.join(__dirname, '/SSOCert.cert');
    	
    	//export complete keychain because security command does not allow to export single identity
        exec("security export -k login.keychain -t identities -P '" + SSOCertificatePassphrase + "' -o '" + SSOCertificatePath+ "' -f pkcs12", function(error, stdout, stderr) {
    	       	
        		//convert pfx to pem
        		exec("openssl pkcs12 -in '" + SSOCertificatePath + "' -out '" + SSOPemPath + "' -passin pass:" + SSOCertificatePassphrase + " -passout pass:" + SSOCertificatePassphrase, function(error, stdout, stderr) {
        			
        			var pemBags = getPemBags(fs.readFileSync(SSOPemPath).toString());
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

    					var SSOCertificate = fs.readFileSync(SSOCertificatePath);
    	        		var deleteCommand = 'rm "' + SSOCertificatePath + '"';
    					exec(deleteCommand, function (error, stdout, stderr) { });	

    					var deleteCommand = 'rm "' + SSOPemPath + '"';
    					exec(deleteCommand, function (error, stdout, stderr) { }); 

    					var deleteCommand = 'rm "' + SSOKeyPath + '"';
    					exec(deleteCommand, function (error, stdout, stderr) { });	

    					var deleteCommand = 'rm "' + SSOCertPath + '"';
    					exec(deleteCommand, function (error, stdout, stderr) { });

                        callback(SSOCertificatePassphrase, SSOCertificate);	   
        		    });

        		} );
    	});
    }
};

exports.execute = function(callback)
{
  runWithPassphrase(Math.random().toString(36).substring(2), callback);
}