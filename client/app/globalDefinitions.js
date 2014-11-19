global.webkitClient = {};
global.webkitClient.showInTaskbar = true;

//make version available from package.json
global.webkitClient.version = gui.App.manifest.version;

global.webkitClient.jQuery = jQuery;
global.webkitClient.gui = gui;
global.webkitClient.serverStarted = function () 
{
    var win = gui.Window.get();    
    createTrayIcon();
    notifiy_started();
};
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