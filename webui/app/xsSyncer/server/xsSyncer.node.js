/*global require, __dirname*/
var fs = require('fs');

try {
	var path = require('path');

	var options = {
		https: true,
		options: {
		    key: fs.readFileSync(path.join(__dirname, '../../../../server/bridge.key')),
		    cert: fs.readFileSync(path.join(__dirname, '../../../../server/bridge.crt'))
		}
	};

	require(path.join(__dirname, './xs-syncer/lib/app.js'))({
		dontask: true,
		settings: JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8')),
		output: require(path.join(__dirname, "./xs-syncer/lib/messageOutput/socketOutput.js")).createInstance(options)
	});
} catch(e) {
	console.log(e);
}
