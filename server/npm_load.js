var path = require('path');
var helper = require('./helper.js');
var fs   = require('fs');

exports.get = function(proxy, npm, callback)
{	
	var server_path = path.join(__dirname, '/');	
	var set_proxy = "";

	if( proxy )
	{
		if(process.platform == "win32") {
			set_proxy = "set http_proxy http_proxy=http://proxy:8080 && set https_proxy=http://proxy:8080 && ";
		}
		else {
			set_proxy = "export http_proxy http_proxy=http://proxy:8080 && export https_proxy=http://proxy:8080 && ";
		}
	}

	var server_modules = path.join(server_path, '/node_modules');
	if(!fs.existsSync(server_modules))
	{
		fs.mkdirSync(server_modules);
	}
	
	helper.wrappedExec(set_proxy + 'cd "' + server_path + '" && ' + npm + ' install', function (error, stdout, stderr) {
		console.log(stderr);		
		callback();		
	});
	
}