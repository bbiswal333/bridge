var bridge 	    = {};
var bridge_repo = "git://github.wdf.sap.corp/Tools/bridge.git";
var path 		= require('path');
var exec        = require('child_process').exec;

var bridge_path = path.join(__dirname, '/');

try{
	bridge = require('bridge');
	console.log("updating bridge..");
	exec("cd " + bridge_path + " && npm update " + bridge_repo, function (error, stdout, stderr) {
		console.log("bridge updated..");
		bridge.run();
	});
}
catch(err){
	console.log("installing bridge..");

	exec("cd " + bridge_path + " && npm install " + bridge_repo, function (error, stdout, stderr) {
		console.log("bridge installed..");
		bridge = require('bridge');
		bridge.run();
	});
}