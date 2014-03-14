var param 		= require('./params.js');
var npm_load	= require('./npm_load.js');
var exec        = require('child_process').exec;

exports.run = function(npm)
{	
	var port   = param.get("port", 8080);
	var proxy  = param.get("proxy", true);
	var mode   = param.get("mode", "all");	

	function update_repo()
	{
		exec('cd /srv/bridge/ && git pull origin master && forever restart server', function (error, stdout, stderr) {
			console.log('updated');			
		});

	}	
	
	function start_server()
	{
		var gith = require('gith').create( port );		

		if (mode == "all" | mode == "commit")
		{
			gith({
				repo: 'bridge/bridge',
	  			branch: 'master'
			}).on( 'file:all', function( payload ) {
	  			console.log( "..file change event received" );
	  			update_repo();  			
			});
		}

		if (mode == "all" | mode == "tag")
		{
			gith({
				repo: 'bridge/bridge'  			
			}).on('tag:add', function( payload ) {
				console.log( "..new tag event received" );
			});
		}	
	}
	
	npm_load.get(proxy, npm, start_server);
}

if(require.main === module){ exports.run('npm'); }