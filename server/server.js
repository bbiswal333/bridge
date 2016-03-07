var https		= require('https');
var path        = require('path');
var fs          = require('fs');
var crypto 		= require('crypto');
var param 		= require('./params.js');
var npm_load	= require('./npm_load.js');
var api			= require('./api.js');
var helper		= require('./helper.js');
var rewrite		= require('./rewriter.js');

exports.run = function(npm, port) {
	var proxy       = param.get("proxy", true);
	var local       = param.get("local", true);
	var cache 	    = param.get("cache", false);
	var host_filter = param.get("host_filter", "127.0.0.1");

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
			console.log(eTag);
		}

		var rules = [
			//"-teams.mo.sap.corp ^\/$ /teamMigration/index.html",
			//"-teams.mo.sap.corp ^\/index.html$ /teamMigration/index.html",
			"-teams.mo.sap.corp /migrationTest /teamMigration/index.html",
			"localhost /migrationTest /teamMigration/index.html"
		];
		app.use(rewrite(rules));

		app.use('/', express.static(path.join(__dirname, '../webui')));
		app.get('/mobile', function(req, res) {
			res.sendfile(path.join(__dirname, '../webui/mobile.html'));
		});
		app.use('/docs', express.static(path.join(__dirname, '../docs')));
		app.use('/badge', express.static(path.join(__dirname, '../badge')));
		//app.use(express.bodyParser());

		var options = {
		    key: fs.readFileSync(path.join(__dirname, 'bridge.key')),
		    cert: fs.readFileSync(path.join(__dirname, 'bridge.crt'))
		};

		var server = https.createServer(options, app);
		api.register(app, user, proxy, npm, eTag);
		if( host_filter === "")
		{
			server.listen(port);
		}
		else
		{
			server.listen(port, host_filter);
		}

		helper.printConsole(port);
		helper.handleException(port);

		if(!local)
		{
			helper.wrappedExec('forever restart updater', function (error, stdout, stderr) {
				console.log('..restarted updater');
			});

			helper.wrappedExec('node ' + path.join(__dirname, './../badge/prodStatusBadge'), function (error, stdout, stderr) {
				console.log('..status badge updated');
			});
		}
	}

	npm_load.get(proxy, npm, start_server);
};

if(require.main === module){
	exports.run('npm', 8000);
}