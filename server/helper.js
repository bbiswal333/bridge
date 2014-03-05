exports.printConsole = function(port)
{	
	console.log(' ____         _      _              ');
	console.log('|  _ \\       (_)    | |            ');
	console.log('| |_) | _ __  _   __| |  __ _   ___ ');
	console.log('|  _ < | \'__|| | / _` | / _` | / _ \\');
	console.log('| |_) || |   | || (_| || (_| ||  __/');
	console.log('|____/ |_|   |_| \\__,_| \\__, | \\___|');
    console.log('	                 __/ |      ');
	console.log('                        |___/       ');
	console.log('Starting Server at http://localhost:' + port);	
}

exports.handleException = function(port)
{
	process.on('uncaughtException', function (error) {				
		var s = new String(error.stack);
		if (s.search(/EADDRINUSE/) > -1)
		{		   		
			console.log("ERROR: Port " + port + " is already used.");
			console.log("ERROR: You can pass the port as a commandline argument to server.js via -port");			   		
		}
		else
		{
			console.log("ERROR: " + error.stack );
		}
		process.exit(1);
	});	
}		