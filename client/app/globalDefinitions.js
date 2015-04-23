/******************************************
 * In this file, the global object is filled, which allows us to pass objects from the nw.js context
 * (where we have jQuery, gui and so on) to the node.js context (all the files which are loaded via require run
 * in the node.js context)
 */
//var utils = require('./utils.js');
global.webkitClient = {};
//global.webkitClient.showInTaskbar = true;
//
////make version available from package.json
global.webkitClient.version = gui.App.manifest.version;

global.webkitClient.jQuery = jQuery;
global.webkitClient.gui = gui;
//global.webkitClient.serverStarted = function (){
//    //var win = gui.Window.get();
//    utils.createTrayIcon();
//    notifiy_started();
//};
/*
global.webkitClient.installNpmModule = function(packageToBeInstalled, callback) {
	var result = null;
	var confirmationFunction = function() { result = confirm("An App running in bridge wants to install '" + packageToBeInstalled + "'. \r\nDo you want to continue?"); };
	var win = gui.Window.get(confirmationFunction);
	win.on('focus', function() {
		if(result === null) {
	  		confirmationFunction.call();
			if(result == true) {
				callback(true, "you confirmend");
			}
			else {
				callback(false, "you didn't confirm");
			}
		}
	});
	win.restore();
	win.focus();
	win.show();
}*/