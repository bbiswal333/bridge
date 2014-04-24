global.jQuery = jQuery;

global.webkitClient = {};
global.webkitClient.serverStarted = function () 
{
    var win = gui.Window.get();
    win.hide();
    createTrayIcon();
};