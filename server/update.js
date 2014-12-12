var param 		= require('./params.js');
var npm_load	= require('./npm_load.js');
var helper = require('./helper.js');

exports.run = function(npm)
{	
	var port   = param.get("port", 8080);
	var proxy  = param.get("proxy", true);
	var mode   = param.get("mode", "tag");	
	var branch = param.get("branch", "master");

	function update_repo()
	{
		helper.wrappedExec('cd /srv/bridge/ && git pull origin ' + branch + ' && forever restart server', function (error, stdout, stderr) {
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
	  			branch: branch
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
				update_repo();  
			});
		}	
	}
	
	npm_load.get(proxy, npm, start_server);
}

if(require.main === module){ exports.run('npm'); }