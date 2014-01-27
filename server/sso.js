var fs           = require('fs');
var path         = require('path');
var exec         = require('child_process').exec;


function getSSOCertSerialNumber(error, stdout, stderr) {
    var SSOCertificateFound = false;
    //var SSOCertificateValid = false;
    var SSOArchived = false;
    var startCertificateSearchString = "================ Certificate";
    var certificateArchivedSearchString = "Archived!";
    var serialNumberSearchString = "Serial Number: ";
    var issuerSearchString = "CN=SSO_CA";
    //var notAfterSearchString = "NotAfter: ";
    var serialNumber = "";

    var allLines = stdout.split("\n");
    if (allLines != null) {
        for (var i = 0; i < allLines.length; i++) {

            if (allLines[i].indexOf(startCertificateSearchString) != -1){
                SSOCertificateFound = false;
                //SSOCertificateValid = false;
                SSOArchived = false;                
            }

            if (allLines[i].indexOf(certificateArchivedSearchString) != -1){
                SSOArchived = true;
            }
            /*if (allLines[i].indexOf(serialNumberSearchString) != -1) {
                serialNumber = allLines[i].substring(allLines[i].indexOf(serialNumberSearchString) + serialNumberSearchString.length);
                SSOCertificateFound = false;
                SSOCertificateValid = false;
            }*/
            if (allLines[i].indexOf(issuerSearchString) != -1) {
                SSOCertificateFound = true;
            }
            /*if (allLines[i].indexOf(notAfterSearchString) != -1) {
                var indexOfSearchString = allLines[i].indexOf(notAfterSearchString);
                var notAfterDate = new Date(parseInt(allLines[i].substring(indexOfSearchString + notAfterSearchString.length + 6, indexOfSearchString + notAfterSearchString.length + 6 + 4)), // Year
                    parseInt(allLines[i].substring(indexOfSearchString + notAfterSearchString.length + 3, indexOfSearchString + notAfterSearchString.length + 3 + 2)) - 1, // Month, month is 0 based so: -1
                    parseInt(allLines[i].substring(indexOfSearchString + notAfterSearchString.length, indexOfSearchString + notAfterSearchString.length + 2)), // Day
                    parseInt(allLines[i].substring(indexOfSearchString + notAfterSearchString.length + 11, indexOfSearchString + notAfterSearchString.length + 11 + 2)), // Hours
                    parseInt(allLines[i].substring(indexOfSearchString + notAfterSearchString.length + 14, indexOfSearchString + notAfterSearchString.length + 14 + 2)), // Minutes
                    0); //Seconds
                if (notAfterDate > new Date())
                    SSOCertificateValid = true;
            }*/

            if (SSOCertificateFound && !SSOArchived)
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
    user.SSOCertificatePassphrase = SSOCertificatePassphrase;

    if(process.platform == "win32") {
    	exec("certutil -store -user -v my", function (error, stdout, stderr) {
    	    var serialNumber = getSSOCertSerialNumber(error, stdout, stderr);
    	    var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
    	    exec("certutil -f -user -p " + SSOCertificatePassphrase + " -exportPFX " + serialNumber + " \"" + SSOCertificatePath + "\"", function (error, stdout, stderr) {
    	        user.SSOCertificate = fs.readFileSync(SSOCertificatePath);
    	        var deleteCommand = 'del "' + SSOCertificatePath + '"';
    	        exec(deleteCommand, function (error, stdout, stderr) { });
                callback(user);
    	    });
    	});
    } else if(process.platform == "darwin") {
    	var SSOCertificatePath = path.join(__dirname, '/SSOCert.pfx');
    	var SSOPemPath         = path.join(__dirname, '/SSOCert.pem');
    	var SSOKeyPath         = path.join(__dirname, '/SSOCert.key');
    	var SSOCertPath        = path.join(__dirname, '/SSOCert.cert');
    	
        exec("security export -k login.keychain -t identities -P '" + SSOCertificatePassphrase + "' -o '" + SSOCertificatePath+ "' -f pkcs12", function(error, stdout, stderr) {   	       	
        		exec("openssl pkcs12 -in '" + SSOCertificatePath + "' -out '" + SSOPemPath + "' -passin pass:" + SSOCertificatePassphrase + " -passout pass:" + SSOCertificatePassphrase, function(error, stdout, stderr) {
        			
        			var identity = getIdentityFromPemBags( getPemBags( fs.readFileSync(SSOPemPath).toString() ) );

        			fs.writeFileSync(SSOCertPath, identity.certificate.data);
        			fs.writeFileSync(SSOKeyPath, identity.key.data);
                    user.id = identity.certificate.user;                

        			exec("openssl pkcs12 -export -out '" + SSOCertificatePath + "' -inkey '" + SSOKeyPath + 
        		      "' -in '" + SSOCertPath+ "'" + " -passin pass:" + SSOCertificatePassphrase + " -passout pass:" + SSOCertificatePassphrase, function(error, stdout, stderr) {

    					user.SSOCertificate = fs.readFileSync(SSOCertificatePath);
    	        		var deleteCommand = 'rm "' + SSOCertificatePath + '" "' + SSOPemPath + '" "' + SSOKeyPath + '" "' + SSOCertPath + '"';
    					exec(deleteCommand, function (error, stdout, stderr) { });	

                        exec("security find-generic-password -a " + identity.certificate.user.toLowerCase() + " -w", function(error, stdout, stderr) {
                            var lines = stdout.toString().split('\n');
                            user.pass = lines[0];
                            callback(user);
                        });      
        		    });

        		} );
    	});
    }
};

exports.execute = function(callback)
{
  runWithPassphrase(Math.random().toString(36).substring(2), callback);
}