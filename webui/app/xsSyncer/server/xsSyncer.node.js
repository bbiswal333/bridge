/*global require, __dirname*/
try {
	var fs = require('fs');
	var path = require('path');

	var options = {
		https: true,
		options: {
		    key: fs.readFileSync(path.join(__dirname, '../../../../server/bridge.key')),
		    cert: fs.readFileSync(path.join(__dirname, '../../../../server/bridge.crt'))
		}
	};

	require('../../../../server/node_modules/xs-syncer')({
		dontask: true,
		settings: JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8')),
		output: require("../../../../server/node_modules/xs-syncer/lib/messageOutput/socketOutput.js").createInstance(options)
	});
} catch(e) {
	//TODO think about some clever error handling here
	//console.log(e);
}
