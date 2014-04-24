﻿var __dirname = getCurrentDirectory();

var gui = require('nw.gui');
var tray;
var bridge = {};
var bridge_repo = 'https://github.wdf.sap.corp/_nodeload/bridge/bridge/tar.gz/';
var settings_file = "settings.json";
var path = require('path');
var exec = require('child_process').exec;
var https = require('https');
var fs = require('fs');

var bridge_path = path.join(__dirname, '/');
var bridge_module = path.join(__dirname, '/node_modules');
var settings_filename = path.join(__dirname, '/', settings_file);
var needs_update = false;
var test_update = false;
var metaData = {};
var latest_tag = 'v0.0';

checkErrorFileSize();

//try to load bridge locally if mentioned in package.json
if (gui.App.manifest.bridge_tag == "local")
{
    try 
    {
        if (process.platform = "win32") {
            bridge = require('../../../');
        } else {
            bridge = require('../../../../../../../');
        }
        bridgeLoadingFinished();
    } 
    catch (err) 
    {
        console.log("could not load bridge locally for testing");
    }
}
else
{
    callBackend('github.wdf.sap.corp', 443, '/api/v3/repos/bridge/bridge/tags', 'GET', function (data) {
        //parse response from github server
        var gitTags = JSON.parse(data);

        //tags can be entered in package.json for testing
        if(gui.App.manifest.bridge_tag)
        {
            latest_tag = gui.App.manifest.bridge_tag; 
            needs_update = true;  
            test_update = true;
        }
        else
        {
            //expecting format vX.Y for version
            for (var i = 0; i < gitTags.length; i++) {
                if (gitTags[i].name[1] > latest_tag[1] || (gitTags[i].name[1] == latest_tag[1] && parseInt(gitTags[i].name.substring(3)) > parseInt(latest_tag.substring(3)))) {
                    latest_tag = gitTags[i].name;
                }
            }
            console.log("Bridge Version on Server: " + latest_tag);

            try {
                metaData = require(settings_filename);
                
                console.log("Bridge Version locally: " + metaData.local_tag);
                if (latest_tag[1] > metaData.local_tag[1] || (latest_tag[1] == metaData.local_tag[1] && parseInt(latest_tag.substring(3)) > parseInt(metaData.local_tag.substring(3)))) {
                 needs_update = true;
                }            

            } catch (err) {
                console.log("No local Bridge Version found.");
                needs_update = true;
            }
        }

        if (needs_update) {

            if (test_update)
            {
                changeTitle("Test Update for Bridge...");
            }
            else
            {
                changeTitle("Updating Bridge...");
            }

            bridge_repo = bridge_repo + latest_tag;
            console.log('updating bridge..');

            if (!fs.existsSync(bridge_module)) {
                fs.mkdirSync(bridge_module);
            }
            exec('cd "' + bridge_path + '" && "node/npm" install ' + bridge_repo + ' --strict-ssl=false --proxy=null --https-proxy=null', function (error, stdout, stderr) {
                logError(stderr);

                if (error == null) {
                    console.log("bridge installed..");
                    changeTitle("Starting Bridge...");

                    //save back metaData
                    if (!metaData.update_tag)
                    {
                        metaData.local_tag = latest_tag;
                        fs.writeFileSync(settings_filename, JSON.stringify(metaData));
                    }

                    bridge = require('bridge');
                    bridgeLoadingFinished();
                }
                else {
                    logError(error);
                }
            });
        }
        else {
            console.log("bridge is already up to date..")
            bridge = require('bridge');
            bridgeLoadingFinished();
        }
    });
}

function bridgeLoadingFinished() {
    try 
    {        
        bridge.run('"../../../node/npm"', 1972);        
    } 
    catch (err) 
    {
        logError(err);
    }
}

function changeTitle(text) {
    var titleDiv = document.getElementById('titleText');
    titleDiv.innerHTML = text;
}