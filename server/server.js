var express = require('express');
var http    = require('http');
var app     = express();

//serve static files in webui folder as http server
app.use('/', express.static('../webui'));
http.createServer(app).listen(80);
