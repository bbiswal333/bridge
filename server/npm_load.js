var path = require('path');
var exec = require('child_process').exec;

exports.get = function(module_name, proxy)
{
	try
	{
		return require(module_name);		
	}
	catch(err)
	{
		var server_path = path.join(__dirname, '/');
		console.log("downloading npm package dependencies..")

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
		if(!path.existsSync(server_modules))
		{
			fs.mkdirSync(server_modules);
		}
		
		exec(set_proxy + "cd " + server_path + ' && ' + npm + ' install', function (error, stdout, stderr) {
			console.log(stderr);
			console.log("npm packages installed..");
			return require(module_name);
		});
	}
}