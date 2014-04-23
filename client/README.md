bridge-client
=============

The bridge client is build with node-webkit to make use of the technologies we already know: Javascript and NodeJs

To build the client for Windows and Mac, you need grunt: http://gruntjs.com/
You probably want to install the grunt-cli package globally to have the grunt command available on your computer. Do that via `npm install grunt-cli -g`.
To get all dependencies, navigate to root folder of the project (Gruntfile.js and package.json are located there), and run `npm install`. Make sure your proxy for npm is set correctly if any errors occur.
From the same directory, just type `grunt` to start the grunt task which will build both clients. You can find the outputs in the build folder once the build process is completed.

Note that the first run might take long, as the necessary dependencies (node, npm and node-webkit) are downloaded and unzipped (for mac and win). On every following run, grunt will detect that the files are already there and they won't get downloaded again.

To speed up the process when you are working on the client and want to test you changes, start `grunt src` instead of `grunt`. This task will just copy the contents of the app folder to the respective locations in the build folder. This avoids uneccessary copying of all the node-webkit files. 

You can add the option "bridge_tag" to the manifest file package.json inside the node-webkit app to fetch a specific tag for testing ("master" might be a good option).

```
{
	"name": "bridge-client",
	"version": "0.0.1",
	"main": "index.html",
	"bridge_tag": "master",
	"window": {
		"show": true,
		"frame": false,
		"width": 400,
		"height": 150,
		"toolbar": false
	}
}
```
