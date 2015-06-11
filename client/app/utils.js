var path = require('path');
var fs = require('fs');
var gui = require('nw.gui');

var Utils = null;

(function(){
    Utils = function(){

    };
    // unlike in node.js, __dirname is not available in node-webkit, this is our workaround. On mac/linux we have a slash, in windows a backslash
    Utils.prototype.getCurrentDirectory = function() {
        return process.cwd()
    };

    Utils.prototype.createTrayIcon = function() {
        // Create a tray icon
        var tray = new gui.Tray({
            title: '',
            icon: 'img/bridge-icon.png',
        });

        tray.tooltip = 'Bridge Client';

        var menu = new gui.Menu();

        var item = new gui.MenuItem({
            label: "Go to Bridge",
            click: function () {
                gui.Shell.openExternal("https://bridge.mo.sap.corp/")
            }
        });
        menu.append(item);

        item = new gui.MenuItem({
            label: "Stop Bridge Client",
            click: function () {
                gui.App.quit();
            }
        });
        menu.append(item);

        item = new gui.MenuItem({
            label: "Show/ Hide In Task Bar",
            click: function () {
                var win = gui.Window.get();
                global.webkitClient.showInTaskbar = !global.webkitClient.showInTaskbar;
                win.setShowInTaskbar(global.webkitClient.showInTaskbar);
            }
        });
        menu.append(item);

        tray.menu = menu;
    };

    var errorLogfile = path.join(Utils.prototype.getCurrentDirectory(), '/error.log');
    Utils.prototype.logError = function(message) {
        fs.appendFileSync(errorLogfile, (new Date()).toUTCString() + " : " + message + "\n");
    };

    Utils.prototype.checkErrorFileSize = function() {
        if (fs.existsSync(errorLogfile)) {
            var fileStats = fs.statSync(errorLogfile);

            // logfileSize bigger than 2 MB -> delete
            if (fileStats.size > 2 * 1024 * 1024) {
                fs.unlinkSync(errorLogfile);
            }
        }
    };
})();
