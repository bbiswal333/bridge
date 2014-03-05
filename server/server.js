var http		= require('http');
var path        = require('path');
var sso 		= require('./sso.js');
var param 		= require('./params.js');
var npm_load	= require('./npm_load.js');
var api			= require('./api.js');
var helper		= require('./helper.js');

exports.run = function(npm)
{	
	var port  = param.get("port", 8000);
	var proxy = param.get("proxy", true);
	var local = param.get("local", true);	
	
	function start_server(user)
	{
		var express = require("express");
		var app 	= express();
		
		app.use('/', express.static(path.join(__dirname, '../webui')));
		api.register(app, user, local, proxy, npm);
		
		if(!local)
		{ 
			http.createServer(app).listen(port);
		}
		else
		{
			http.createServer(app).listen(port, "localhost");
		}

		helper.printConsole(port);		
		helper.handleException(port);		
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

if(require.main === module){ exports.run('npm'); }