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

	require('../../../../server/xs-syncer/app.js')({
		dontask: true,
		settings: JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8')),
		output: require("../../../../server/xs-syncer/messageOutput/socketOutput.js").createInstance(options)
	});
} catch(e) {
	//TODO think about some clever error handling here
	//console.log(e);
}
