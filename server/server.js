var https		= require('https');
var path        = require('path');
var fs          = require('fs');
var sso 		= require('./sso.js');
var param 		= require('./params.js');
var npm_load	= require('./npm_load.js');
var api			= require('./api.js');
var helper		= require('./helper.js');

exports.run = function(npm)
{	
	var port        = param.get("port", 1972);
	var proxy       = param.get("proxy", true);
	var local = param.get("local", true);

	helper.checkErrorFileSize();

	function start_server(user)
	{
		var express = require("express");
		var app 	= express();
		var socket  = require('socket.io');
		
		app.use('/', express.static(path.join(__dirname, '../webui')));
		app.use('/docs', express.static(path.join(__dirname, '../docs')));		
	    
		var options = {
		    key: fs.readFileSync(path.join(__dirname, 'bridge.key')),
		    cert: fs.readFileSync(path.join(__dirname, 'bridge.crt'))
		};
		
		var server = https.createServer(options, app);
		var socketio = socket.listen(server);						
		api.register(app, user, local, proxy, npm, socketio);
		
		server.listen(port, "127.0.0.1");
	 	

		helper.printConsole(port);		
		helper.handleException(port);		
		if(!local)
		{
			helper.wrappedExec('forever restart updater', function (error, stdout, stderr) {
				console.log('..restarted updater');			
			});
		}
	}
	
	function sso_start_server()
	{
		if (!local)
		{
			start_server();
		}
		else 
		{
			sso.execute( start_server );
		}
	}

	npm_load.get(proxy, npm, sso_start_server);
}

if(require.main === module){ 	
	exports.run('npm'); 
}