var express = require('express');
var https = require('https');
var call_https = require('https');
var fs = require('fs');
var util = require('util');


var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem'),
  requestCert: true
};

var app = express();

app.get('/', function(req, res){
  
  fs.readFile('../webui/index.html',function (err, data){    
    res.writeHead(200, {'Content-Type': 'text/html'});
    var client_cert = req.connection.getPeerCertificate();
    
    res.write(data);
    //res.write("User Name: " + util.inspect(client_cert.subject.CN, false, null));
    //res.write("CERT: " + util.inspect(req.connection.getPeerCertificate(), false, null)); 
    res.end();    
    });
});

app.use('/', express.static('../webui'));

https.createServer(options, app).listen(443);
