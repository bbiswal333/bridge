var https		= require('https');
var http		= require('http');
var path        = require('path');
var url         = require('url');
var exec        = require('child_process').exec;
var fs 			= require("fs");

exports.EWSClient = function (dateFrom_s, dateTo_s, exchangeURI_s, user_o) { 
	const SOAP_TEMPLATE_FILE = path.join(__dirname, "\\") + "exchange_soap_template.xml";
	const PARAM_NAME_FROM = "from";
	const PARAM_NAME_TO = "to";
	const PLACEHOLDER_FROM = "%DATEFROM%";
	const PLACEHOLDER_TO = "%DATETO%";
	const ERR_MSG_PLATFORM_NOT_SUPPORTED = "Your platform doesn't support this feature - only Windows and Mac OS X are supported.";
	const ERR_MSG_CONNECTION_TO_EXCHANGE = "An error occured during request to the Microsoft Exchange server.";
	const ERR_MSG_WRONG_CREDENTIALS = "Seems your credentials were wrong. Please try again.";
	const SAP_DOMAIN = "SAP_ALL\\";

	var dateFrom = dateFrom_s;
	var dateTo = dateTo_s;
	var exchangeURI = exchangeURI_s; 
	var user = paramDefault(user_o, null);

	var soapTmpPath = path.join(__dirname, "\\");

	if (dateFrom == undefined || dateTo == undefined) {
		throw new Error("dateFrom_s and dateTo_s must not be undefined.");
	}

	if (dateFrom == "" || dateTo == "") {
		throw new Error("dateFrom_s and dateTo_s must not ne empty.");
	}

	if (dateFrom.length != 20 || dateTo.length != 20) {
		throw new Error("dateFrom_s and dateTo_s must follow the scheme \"YYYY-MM-DDTHH:MM:SSZ\", e.g. \"1789-08-04T23:59:00Z\"");	
	}

	/* callback_fn : Function to be called when data has been fetched from EWS (given parameter will be the fetched xml) 
	   or if an error occured (given parameter will be an Error-object) .
	   You have to set response header to plain text: >>response.setHeader('Content-Type', 'text/plain');<< when testing in browser - it might recommended to do this in general. */
	this.doRequest = function (callback_fn) {
		readSoapTemplate(function (data) {
			data = data.replace(PLACEHOLDER_FROM, dateFrom);
			data = data.replace(PLACEHOLDER_TO, dateTo);

			if (process.platform == "win32") {
				//Windows strategy: Writing SOAP in file, calling cURL with this file as parameter, let cURL write its output to temporary file, then read in this temporary file and send its content back to the user
				// var start = process.hrtime();
				getDataFromExchange_Win(data, function (ews_xml) {
					//var diff = process.hrtime(start);		
					// console.log("WIN strategy took " + diff[0] * 1e9 + diff[1] + " ns, this would be " + diff[0] + diff[1] / 1e9 + " seconds.");
					callback_fn(ews_xml);
				});
			}
			else if (process.platform == "darwin") { //Mac OS X
				//Mac OS X strategy: Fetching data directly via https and Basic Authentification. Therefore SAP-User and password is retrived from keychain and encoded with Base64
				// var start = process.hrtime();
				getDataFromExchange_Mac(data, function (ews_xml) {
					//var diff = process.hrtime(start);		
					// console.log("MAC strategy took " + diff[0] * 1e9 + diff[1] + " ns, this would be " + diff[0] + diff[1] / 1e9 + " seconds.");
					callback_fn(ews_xml);
				});						
			}
			else {
				console.log(ERR_MSG_PLATFORM_NOT_SUPPORTED);
				callback_fn(new Error(ERR_MSG_PLATFORM_NOT_SUPPORTED));
			}
		});
	};

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
		var filename = soapTmpPath + generateUniqueFileName();
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
			var curlPath = path.join(__dirname, "\\") + "curl\\curl.exe";
			var cmd = curlPath + ' -d @' + soapFile_s + ' --insecure -H "Content-Type: text/xml; charset=utf-8" --ntlm -u : "' + exchangeURI + '" > "' + soapFile_s + "_answer\"";

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
			} while (fs.existsSync(soapTmpPath + name));

			return name;
		}
	}

	function getDataFromExchange_Mac(soapString_s, callback_fn) {
		var auth = new Buffer(SAP_DOMAIN + user.id + ':' + user.pass).toString('base64');

		var ews_url = url.parse(exchangeURI);

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

		var data = "";

		var req = https.request(options, function(res) {
			res.on('data', function(chunk) { 
				data += chunk; 
			});
			res.on('end', function() {
				if (data == "") {
					console.log(ERR_MSG_WRONG_CREDENTIALS);
					callback_fn(new Error(ERR_MSG_WRONG_CREDENTIALS));
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
			callback_fn(new Error(ERR_MSG_CONNECTION_TO_EXCHANGE));
		});							
	}	
};

function paramDefault(thing_o, def_o) {
	try {
		return (thing_o != undefined ? thing_o : def_o);
	} catch (e) {
		return def_o;
	}
}