var https		= require('https');
var path        = require('path');
var fs          = require('fs');
var crypto 		= require('crypto');
var sso 		= require('./sso.js');
var param 		= require('./params.js');
var npm_load	= require('./npm_load.js');
var api			= require('./api.js');
var helper		= require('./helper.js');

exports.run = function(npm, port)
{	
	var proxy = param.get("proxy", true);
	var local = param.get("local", true);
	var cache = param.get("cache", false);

	helper.checkErrorFileSize();

	function start_server(user)
	{
		var express = require("express");
		var app 	= express();

		var eTag = undefined;
		if(cache)
		{			
			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			eTag = '"' + crypto.createHash('sha1').update(current_date + random).digest('hex') + '"';
		}
		
		app.use('/', express.static(path.join(__dirname, '../webui')));
		app.use('/docs', express.static(path.join(__dirname, '../docs')));
		app.use(express.bodyParser());
	    
		var options = {
		    key: fs.readFileSync(path.join(__dirname, 'bridge.key')),
		    cert: fs.readFileSync(path.join(__dirname, 'bridge.crt'))
		};
		
		var server = https.createServer(options, app);		
		api.register(app, user, local, proxy, npm, eTag);	 	
		server.listen(port, "127.0.0.1");		
		
		helper.printConsole(port);		
		helper.handleException(port);		
		
		if (typeof webkitClient !== 'undefined' && webkitClient) 
		{
		    webkitClient.serverStarted();
		}		
		
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
			start_server();
			//Removed SSO due to missing possibility to export the client certificate on MAC
			//sso.execute( start_server );
		}
	}

	npm_load.get(proxy, npm, sso_start_server);
}

if(require.main === module){ 	
	exports.run('npm', 8000); 
}