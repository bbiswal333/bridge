/*global require, __dirname*/
var fs = require('fs');
var path = require('path');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
var configPath = path.join(getUserHome(), "xsSyncerConfig.json");

try {
	var options = {
		https: true,
		options: {
		    key: fs.readFileSync(path.join(__dirname, '../../bridge.key')),
		    cert: fs.readFileSync(path.join(__dirname, '../../bridge.crt'))
		}
	};

	require(path.join(__dirname, './xs-syncer/lib/app.js'))({
		dontask: true,
		settings: JSON.parse(fs.readFileSync(configPath, 'utf8')),
		output: require(path.join(__dirname, "./xs-syncer/lib/messageOutput/socketOutput.js")).createInstance(options)
	});
} catch(e) {
	console.log(e);
}
