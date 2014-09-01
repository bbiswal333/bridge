/*global __dirname, require, process*/
var child;
var configPath = __dirname + "/config.json";
var fs = require('fs');

module.exports = function(app) {
	app.post("/api/xsSyncer/start", function(request, response) {
		if(child) {
			response.send({error: true, message: "already running"});
			return;
		}

		if(!fs.existsSync(configPath)) {
			response.send({error: true, message: "No config exists. Please configure xs-syncer first."});
			return;
		}

		var exception;
		try {
			var path = require('path');
			var nodePath =   path.join(path.dirname(process.execPath), '../../../../Resources/app.nw/node/bin/node');
			if (process.platform === 'win32') {
				nodePath += ".exe";
			}

			/*
			29.08.2014 - D049677
			child_process.fork() does not work in node wekkit, as it forks the webkit version.
			We could set process.execPath to the node executable, but unfortunately this still does not work.
			It's a bug which should be fixed with the newer versions.
			Refer to this issue: https://github.com/rogerwang/node-webkit/issues/213
			*/

			child = require("child_process").exec(nodePath + " " + __dirname + "/xsSyncer.node.js");
		} catch(e) {
			exception = e;
		} finally {
			if(child) {
				response.send({error: false, message: "xs-syncer started", pid: child.pid, nodePath: nodePath});
			} else {
				response.send({error: true, message: "xs-syncer not started", exception: exception.message});
			}
		}
	});
	app.get("/api/xsSyncer/stop", function(request, response) {
		if(child) {
			child.kill();
			child = null;
			response.send({error: false, message: "Sent signal 'kill' to xs-syncer"});
		} else {
			response.send({error: true, message: "xs-syncer not running or not started using bridge"});
		}
	});

	app.get("/api/xsSyncer/getConfig", function(request, response) {
		if(!fs.existsSync(configPath)) {
			response.send({error: true, message: "No config exists. Please configure xs-syncer first."});
			return;
		}

		response.send(fs.readFileSync(configPath, 'utf8'));
	});

	app.post("/api/xsSyncer/setConfig", function(request, response) {
		try {
			fs.writeFileSync(configPath, JSON.stringify(request.body));
		} catch(e) {
			response.send({error: true, message: e.message});
			return;
		}

		response.send({error: false, message: "Config saved"});
	});
};
