var fs           = require('fs');
var path         = require('path');
var exec         = require('child_process').exec;

var errorLogfile = path.join(__dirname, '/error.log'); 
function  logError(message) {
    fs.appendFileSync(errorLogfile, (new Date()).toUTCString() + " : " + message + "\n");
    console.log(message);
}

function wrappedExec(execString, callbackFn) {
    exec(execString, function (error, stdout, stderr) {
        if (error == null) {
            callbackFn(error, stdout, stderr);
        } else {
            logError(error);
            callbackFn(error, stdout, stderr);
        }
    });
};

function getSSOCertSerialNumber(error, stdout, stderr) {
    var SSOCertificateFound = false;
    var SSOArchived = false;
	var startCertificateSearchString = "================ ";
	var certificateArchivedSearchString = "!";
	var serialNumberSearchString = ": ";
    var issuerSearchString = "CN=SSO_CA";
    var serialNumber = "";

    var allLines = stdout.split("\n");
    if (allLines != null) {
        for (var i = 0; i < allLines.length; i++) {

            if (allLines[i].indexOf(startCertificateSearchString) != -1){
				// start of next certificate area found
				if (allLines[i+1].indexOf(certificateArchivedSearchString) != -1){
					// first line contains "Archived!", we don't need archived certificates
					continue;
				} 
				else {
					// if we don't have archived in line i+1, then we can check for the issuer in line i+2
					if (allLines[i+2].indexOf(issuerSearchString) != -1){
						// we are not archived, and we have the correct issuer, now get the serial number, which is in line i+1
						serialNumber = allLines[i+1].substring(allLines[i+1].indexOf(serialNumberSearchString) + serialNumberSearchString.length);
						return serialNumber;
					}
					else {
						continue;
					}
				}                
            }
        }
		
		return serialNumber;
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

        if (pemLine.indexOf("subject=") != -1)
        {
            var subject = pemLine.substring(pemLine.indexOf("subject=") + "subject=".length);
            bag.user = subject.substring(subject.indexOf("CN=") + "CN=".length);            
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

function getIdentityFromPemBags(pemBags)
{
    var identity = {};

    for (var i = 0; i < pemBags.length; i++) {
        if( pemBags[i].type === "certificate" && pemBags[i].issuer.indexOf("SSO_CA") != -1 )
        {
            identity.certificate = pemBags[i];
        }
    }

    for (var i = 0; i < pemBags.length; i++) {
        if( pemBags[i].type === "private key"  && pemBags[i].localKeyID === identity.certificate.localKeyID )
        {
            identity.key = pemBags[i];
        }
    }

    return identity;
}

function runWithPassphrase(SSOCertificatePassphrase, callback)
{
    var user = {};
    user.caCertificate = fs.readFileSync(path.join(__dirname, "/SAPNetCA.pem")).toString()
    user.passphrase = SSOCertificatePassphrase;

    if(process.platform == "win32") {
		// removed -v option, we don't need verbose output
        wrappedExec("certutil -store -user my", function (error, stdout, stderr) {
    	    var serialNumber = getSSOCertSerialNumber(error, stdout, stderr);
    	    var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');

            if( serialNumber === "")
            {
                console.log("No certificate found !");
                return;
            }

            wrappedExec("certutil -f -user -p " + SSOCertificatePassphrase + " -exportPFX " + serialNumber + " \"" + SSOCertificatePath + "\"", function (error, stdout, stderr) {
                user.pfx = fs.readFileSync(SSOCertificatePath);
                var deleteCommand = 'del "' + SSOCertificatePath + '"';
                wrappedExec(deleteCommand, function (error, stdout, stderr) { });
                callback(user);
    	    });
    	});
    } else if(process.platform == "darwin") {
    	var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
    	var SSOPemPath         = path.join(__dirname, '/SSOCert.pem');
    	
        wrappedExec('cd "' + __dirname + '" && chmod 777 mac_keychain_identity/mac_keychain_identity && mac_keychain_identity/mac_keychain_identity -P "' + SSOCertificatePassphrase + '" -o "' + SSOCertificatePath + '"', function (error, stdout, stderr)
        {
    	    wrappedExec("openssl pkcs12 -in '" + SSOCertificatePath + "' -out '" + SSOPemPath + "' -passin pass:" + SSOCertificatePassphrase + " -passout pass:" + SSOCertificatePassphrase, function (error, stdout, stderr) {
                var identity = getIdentityFromPemBags(getPemBags(fs.readFileSync(SSOPemPath).toString()));

                user.certificate = identity.certificate.data;
                user.key = identity.key.data;
  
                callback(user);
            });
    	});
    }
};

exports.execute = function(callback)
{
  runWithPassphrase(Math.random().toString(36).substring(2), callback);
}