var __dirname = getCurrentDirectory();

var gui = require('nw.gui');
var tray;
var local_bridge = false;
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


//try to load bridge locally
try {
    bridge = require('../../');
    local_bridge = true;
    bridgeLoadingFinished();
} 
catch (err) {
    local_bridge = false;
}

//if not load from github
if( !local_bridge )
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
    try {        
        bridge.run('"../../../node/npm"');
        
        function waitForClient(max, callback){
            $.get('https://localhost:1972/client', function() {
                callback();
            }).fail( function() {
                if( max > 0 )
                {
                    var nmax = max - 1;
                    setTimeout(function(){waitForClient(nmax, callback)}, 500);
                }
            });
        }

        waitForClient(50, function(){
            //load socket.io from server
            var s = document.createElement("script");
            s.setAttribute("src", "https://localhost:1972/socket.io/socket.io.js");
            s.onload = function(){   

                clientLoaded();         
                
            }
            document.head.appendChild(s);        
        });

        function clientLoaded(){
            var socket = io.connect('https://localhost:1972');
            
            socket.on('client', function (request) {                
                var response = {};
                $.get(request.url, function(data) {
                    response.code = 200;
                    response.data = data;
                    socket.emit('client_response', response); 
                }).fail( function() {
                    response.code = 500;
                    socket.emit('client_response', response)
                });                
            });

            var win = gui.Window.get();
            win.hide();
            createTrayIcon();
        }

    } catch (err) {
        logError(err);
    }
}

function changeTitle(text) {
    var titleDiv = document.getElementById('titleText');
    titleDiv.innerHTML = text;
}