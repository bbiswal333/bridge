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