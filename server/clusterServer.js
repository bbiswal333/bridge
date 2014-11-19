var cluster = require("cluster");
var numCPUs = require('os').cpus().length;

if(cluster.isMaster) {
	for(var i = 0; i < numCPUs; i++) {
		console.log("forking new instance");
		cluster.fork();
	}
} else {
	require('./server.js').run("npm", 8000);
}
