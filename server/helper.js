var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

exports.printConsole = function (port)
{		
	console.log('   ____         _      _                ');
	console.log('  |  _ \\       (_)    | |               ');
	console.log('  | |_) | _ __  _   __| |  __ _   ___   ');
	console.log('  |  _ < | \'__|| | / _` | / _` | / _ \\  ');
	console.log('  | |_) || |   | || (_| || (_| ||  __/  ');
	console.log('  |____/ |_|   |_| \\__,_| \\__, | \\___|  ');
  	console.log('	                   __/ |        ');
	console.log('                          |___/         ');
	console.log('                                        ');		
}

exports.handleException = function(port)
{
	var clc = require('cli-color');
	process.on('uncaughtException', function (error) {				
		var s = new String(error.stack);
		if (s.search(/EADDRINUSE/) > -1)
		{		   		
			console.log(clc.redBright("ERROR: Port " + port + " is already used."));
			console.log(clc.redBright("ERROR: You can pass the port as a commandline argument to server.js via -port"));			   		
		}
		else
		{
			console.log(clc.redBright("ERROR: " + error.stack));
		}
		process.exit(1);
	});	
}

var errorLogfile = path.join(__dirname, '/error.log'); 
exports.logError = function (message) {
    fs.appendFileSync(errorLogfile, (new Date()).toUTCString() + " : " + message + "\n");
    console.log(message);
}
exports.checkErrorFileSize = function() {
    if (fs.existsSync(errorLogfile)) {
        var fileStats = fs.statSync(errorLogfile);

        // logfileSize bigger than 2 MB -> delete
        if (fileStats.size > 2 * 1024 * 1024) {
            fs.unlinkSync(errorLogfile);
        }
    }
}

exports.wrappedExec = function (execString, callbackFn) {
    exec(execString, function (error, stdout, stderr) {
        if (error == null) {
            callbackFn(error, stdout, stderr);
        } else {
            exports.logError(error);
            callbackFn(error, stdout, stderr);
        }
    });
}