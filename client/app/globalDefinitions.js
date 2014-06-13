global.webkitClient = {};

global.webkitClient.jQuery = jQuery;
global.webkitClient.gui = gui;
global.webkitClient.serverStarted = function () 
{
    var win = gui.Window.get();    
    createTrayIcon();
    notifiy_started();
};