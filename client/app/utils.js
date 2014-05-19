var path = require('path');
var fs = require('fs');

// unlike in node.js, __dirname is not available in node-webkit, this is our workaround. On mac/linux we have a slash, in windows a backslash
function getCurrentDirectory() {
    return process.cwd()
}

function createTrayIcon() {

    // Create a tray icon
    tray = new gui.Tray({
        title: 'Bridge',
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

    tray.menu = menu;
}

function callBackend(hostname, port, path, method, callback) {
    var options = {
        hostname: hostname,
        port: port,
        path: path,
        method: method,
        rejectUnauthorized: false
    };

    var data = "";
    console.log(method.toUpperCase() + ": https://" + hostname + ":" + port + path);

    var req = https.request(options, function (res) {
        res.on('data', function (chunk) { data += chunk; });
        res.on('end', function () { callback(data); });
    });

    if (method.toLowerCase() == "post" && postData != undefined) {
        req.write(postData);
    }

    req.end();
    req.on('error', function (e) {
        console.error(e);
    });
}

var errorLogfile = path.join(getCurrentDirectory(), '/error.log');
function logError(message) {
    fs.appendFileSync(errorLogfile, (new Date()).toUTCString() + " : " + message + "\n");
}

function checkErrorFileSize() {
    if (fs.existsSync(errorLogfile)) {
        var fileStats = fs.statSync(errorLogfile);

        // logfileSize bigger than 2 MB -> delete
        if (fileStats.size > 2 * 1024 * 1024) {
            fs.unlinkSync(errorLogfile);
        }
    }
}