var gui = require('nw.gui');
var path = require("path");
var fs = require("fs");
var utils = new Utils();
var localProxyServer = require('./localProxyServer.js');

var __dirname = utils.getCurrentDirectory();
//var settings_filename = path.join(__dirname, '/', settings_file);
var manifest_filename = path.join(__dirname, '/', "package.json");

//var settings = null;

utils.checkErrorFileSize();
registerWindowHandler();

//try {
//    settings = require(settings_filename);
//} catch (err) {
//    console.log("settings file not found");
//    settings = {};
//}

localProxyServer.start();
utils.createTrayIcon();



function saveManifest(){
    fs.writeFileSync(manifest_filename,JSON.stringify(gui.App.manifest));
}

function hideWindow() {
    var win = gui.Window.get();
    win.hide();
}

function gotoBridge() {
    gui.Shell.openExternal('https://bridge.mo.sap.corp');
    hideWindow();
}

function registerWindowHandler() {
    var win = gui.Window.get();
    win.on('close', function () {
        this.hide();
    });
}

function checkboxHide_changed(){
    var input = $("#checkboxHideInput")[0];

    gui.App.manifest.window.show = !input.checked;
    saveManifest();
}