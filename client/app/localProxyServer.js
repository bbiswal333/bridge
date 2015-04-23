var express = require("express"),
    https	= require('https'),
    path    = require('path'),
    api		= require('./api.js');
    fs      = require('fs');

exports.start = function(){
    var options = {
        key: fs.readFileSync(path.join(__dirname, "certs", 'bridge.key')),
        cert: fs.readFileSync(path.join(__dirname, "certs", 'bridge.crt'))
    };

    var app = express();
    var server = https.createServer(options, app);
    server.listen(1972, "127.0.0.1");

    api.register(app);
};
