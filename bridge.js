var bridge 	    = {};
var bridge_repo = 'https://github.wdf.sap.corp/_nodeload/Tools/bridge/tar.gz/master';
var path 		= require('path');
var exec        = require('child_process').exec;

var bridge_path = path.join(__dirname, '/');

try{
	bridge = require('bridge');
	console.log('updating bridge..');
	exec('cd ' + bridge_path + ' && ../node/bin/npm install ' + bridge_repo + ' --strict-ssl=false --proxy=null --https-proxy=null', function (error, stdout, stderr) {
		console.log(stderr);
		console.log("bridge updated..");
		bridge.run('../node/bin/npm');
	});
}
catch(err){
	console.log("installing bridge..");

	exec('cd ' + bridge_path + ' && ../node/bin/npm install ' + bridge_repo + ' --strict-ssl=false --proxy=null --https-proxy=null', function (error, stdout, stderr) {
		console.log(stderr);
		console.log("bridge installed..");
		bridge = require('bridge');
		bridge.run('../node/bin/npm');
	});
}
