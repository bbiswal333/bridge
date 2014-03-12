exports.printConsole = function(port)
{	
	var clc = require('cli-color');
	console.log(clc.bgBlueBright.whiteBright('   ____         _      _                '));
	console.log(clc.bgBlueBright.whiteBright('  |  _ \\       (_)    | |               '));
	console.log(clc.bgBlueBright.whiteBright('  | |_) | _ __  _   __| |  __ _   ___   '));
	console.log(clc.bgBlueBright.whiteBright('  |  _ < | \'__|| | / _` | / _` | / _ \\  '));
	console.log(clc.bgBlueBright.whiteBright('  | |_) || |   | || (_| || (_| ||  __/  '));
	console.log(clc.bgBlueBright.whiteBright('  |____/ |_|   |_| \\__,_| \\__, | \\___|  '));
  	console.log(clc.bgBlueBright.whiteBright('	                   __/ |        '));
	console.log(clc.bgBlueBright.whiteBright('                          |___/         '));
	console.log(clc.bgBlueBright.whiteBright('                                        '));	
	console.log("");
	//console.log(clc.cyanBright('Starting Server at http://localhost:' + port));	
	console.log(clc.greenBright('Please keep this window open and refresh Bridge in your browser!'));	
	console.log("");
}

exports.handleException = function(port)
{
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