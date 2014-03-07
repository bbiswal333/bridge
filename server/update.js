var param 		= require('./params.js');
var npm_load	= require('./npm_load.js');

exports.run = function(npm)
{	
	var port   = param.get("port", 8001);
	var proxy  = param.get("proxy", true);	
	
	function start_server()
	{
		var gith = require('gith').create( port );
		console.log("Git Hook Server started.");

		gith({
		}).on( 'all', function( payload ) {
  			console.log( payload );  			
		});

	
	}
	
	npm_load.get(proxy, npm, start_server);
}

if(require.main === module){ exports.run('npm'); }