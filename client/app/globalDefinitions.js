global.webkitClient = {};

global.webkitClient.jQuery = jQuery;
global.webkitClient.serverStarted = function () 
{
    var win = gui.Window.get();    
    createTrayIcon();
    win.hide();
    notifiy_started();
};