/*global __dirname, require, process*/
var child;
var fs = require('fs');
var path = require('path');
var cors = require('../../cors.js');

module.exports = function(app) {
	function getUserHome() {
	  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
	}
	var configPath = path.join(getUserHome(), "xsSyncerConfig.json");

	app.post("/api/xsSyncer/start", function(request, response) {
		cors(request, response);

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

			child = require("child_process").exec(nodePath + " " + path.join(__dirname, "xsSyncer.js"),
			function (error, stdout, stderr) {
			    if (error !== null) {
			    	child = null;
			    	console.log('exec error:');
			    	console.log(error);
			    }
			});
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
	app.options("/api/xsSyncer/start", function(request, response){
		response = cors( request, response );	
		response.send();
		return;
	});

	app.get("/api/xsSyncer/stop", function(request, response) {
		cors(request, response);

		if(child) {
			child.kill();
			child = null;
			response.send({error: false, message: "Sent signal 'kill' to xs-syncer"});
		} else {
			response.send({error: true, message: "xs-syncer not running or not started using bridge"});
		}
	});

	app.get("/api/xsSyncer/getConfig", function(request, response) {
		cors(request, response);

		if(!fs.existsSync(configPath)) {
			response.send({error: true, message: "No config exists. Please configure xs-syncer first."});
			return;
		}

		response.send(fs.readFileSync(configPath, 'utf8'));
	});

	app.post("/api/xsSyncer/setConfig", function(request, response) {
		cors(request, response);

		try {
			fs.writeFileSync(configPath, JSON.stringify(request.body));
		} catch(e) {
			response.send({error: true, message: e.message});
			return;
		}

		response.send({error: false, message: "Config saved"});
	});

	app.options("/api/xsSyncer/setConfig", function(request, response){
		response = cors( request, response );	
		response.send();
		return;
	});
};
