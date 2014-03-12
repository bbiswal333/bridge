exports.printConsole = function(port)
{	
	var clc = require('cli-color');
	console.log(clc.reset);
	console.log('   ____         _      _                ');
	console.log('  |  _ \\       (_)    | |               ');
	console.log('  | |_) | _ __  _   __| |  __ _   ___   ');
	console.log('  |  _ < | \'__|| | / _` | / _` | / _ \\  ');
	console.log('  | |_) || |   | || (_| || (_| ||  __/  ');
	console.log('  |____/ |_|   |_| \\__,_| \\__, | \\___|  ');
  	console.log('	                   __/ |        ');
	console.log('                          |___/         ');
	console.log('                                        ');	
	console.log('');	
	console.log(clc.greenBright('Please keep this window open and refresh Bridge in your browser!'));		
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