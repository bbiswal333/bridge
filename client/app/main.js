﻿var gui = require('nw.gui');
var path = require('path');
var exec = require('child_process').exec;
var https = require('https');
var fs = require('fs');
var utils = require('./utils.js');
var localProxyServer = require('./localProxyServer.js');

var __dirname = utils.getCurrentDirectory();
var tray;
var bridge = {};
var bridge_repo = 'https://github.wdf.sap.corp/bridge/bridge/archive/';
var settings_file = "settings.json";
var bridge_path = path.join(__dirname, '/');
var bridge_module = path.join(__dirname, '/node_modules');
var settings_filename = path.join(__dirname, '/', settings_file);
var manifest_filename = path.join(__dirname, '/', "package.json");
var needs_update = false;
var test_update = false;
var latest_tag = 'v0.0';
var settings = null;

utils.checkErrorFileSize();
registerWindowHandler();

try {
    settings = require(settings_filename);
} catch (err) {
    console.log("settings file not found");
    settings = {};
}

localProxyServer.start(gui, jQuery);

//try to load bridge locally if mentioned in package.json
/*if (gui.App.manifest.bridge_tag == "local") {
    try {
        if (process.platform == "win32") {
            bridge = require('../../../');
        } else {
            bridge = require('../../../../../../../');
        }
        bridgeLoadingFinished();
    }
    catch (err) {
        console.log("could not load bridge locally for testing");
    }
}
else {
    utils.callBackend('github.wdf.sap.corp', 443, '/api/v3/repos/bridge/bridge/tags', 'GET', function (data){
        //check if github is not reachable
        if(data === undefined){
            needs_update = false;            
        } else {
            //parse response from github server
            var gitTags = JSON.parse(data);

            //tags can be entered in package.json for testing
            if (gui.App.manifest.bridge_tag) {
                latest_tag = gui.App.manifest.bridge_tag;
                needs_update = true;
                test_update = true;
            }
            else {
                //expecting format vX.Y for version
                for (var i = 0; i < gitTags.length; i++) {
                    if (gitTags[i].name[1] > latest_tag[1] || (gitTags[i].name[1] == latest_tag[1] && parseInt(gitTags[i].name.substring(3)) > parseInt(latest_tag.substring(3)))) {
                        latest_tag = gitTags[i].name;
                    }
                }
                console.log("Bridge Version on Server: " + latest_tag);

                if (settings !== null && settings.local_tag != undefined){
                    console.log("Bridge Version locally: " + settings.local_tag);
                    if (latest_tag[1] > settings.local_tag[1] || (latest_tag[1] == settings.local_tag[1] && parseInt(latest_tag.substring(3)) > parseInt(settings.local_tag.substring(3)))) {
                        needs_update = true;
                    }

                } else {
                    console.log("No local Bridge Version found.");
                    needs_update = true;
                }
            }
        }

        if (needs_update) {

            if (test_update) {
                changeTitle("Test Update..");
            }
            else {
                changeTitle("Updating..");
            }

            bridge_repo = bridge_repo + latest_tag + ".tar.gz";
            console.log('updating bridge..');

            if (!fs.existsSync(bridge_module)) {
                fs.mkdirSync(bridge_module);
            }

            var npmPath;
            if (process.platform == "win32") {
                npmPath = "node/npm";
            } else {
                npmPath = "node/bin/npm";
            }
            exec('cd "' + bridge_path + '" && "' + npmPath + '" install ' + bridge_repo + ' --strict-ssl=false --proxy=null --https-proxy=null', function (error, stdout, stderr) {
                utils.logError(stderr);

                if (error == null) {
                    console.log("bridge installed..");
                    changeTitle("Starting..");

                    //save back metaData
                    if (!settings.update_tag) {
                        settings.local_tag = latest_tag;
                        saveSettings();
                    }

                    bridge = require('bridge');
                    bridgeLoadingFinished();
                }
                else {
                    utils.logError(error);
                }
            });
        }
        else {
            console.log("bridge is already up to date..");
            bridge = require('bridge');
            bridgeLoadingFinished();
        }
    });
}*/

function notifiy_started(){
    changeTitle("Bridge Client is now running.<br />Refresh Bridge in your browser or<br/>");

    var link = $("#openBridgeLink");
    link.css("display", "normal");

    var button = $("#closeWindowButton");
    button.css("display", "normal");

    var checkbox = $("#checkboxHide");
    checkbox.css("display", "normal");
};

function saveSettings(){
    fs.writeFileSync(settings_filename, JSON.stringify(settings));
}

function saveManifest(){
    fs.writeFileSync(manifest_filename,JSON.stringify(gui.App.manifest));
}

function bridgeLoadingFinished() {
    try {
        if (process.platform == "win32") {
            bridge.run('"../../../node/npm"', 1972);
        } else {
            bridge.run('../../../node/bin/npm', 1972);
        }
    }
    catch (err) {
        utils.logError(err);
    }
}

function changeTitle(text) {
    var titleDiv = document.getElementById('titleText');
    titleDiv.innerHTML = text;
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