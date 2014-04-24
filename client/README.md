bridge-client
=============

The bridge client is build with node-webkit to make use of the technologies we already know: Javascript and NodeJs

To build the client for Windows and Mac, you need grunt: http://gruntjs.com/
You probably want to install the grunt-cli package globally to have the grunt command available on your computer. Do that via `npm install grunt-cli -g`.
To get all dependencies, navigate to root folder of the project (Gruntfile.js and package.json are located there), and run `npm install`. Make sure your proxy for npm is set correctly if any errors occur.
From the same directory, just type `grunt` to start the default grunt task which will build both clients. You can find the outputs in the build folder once the build process is completed.
Note that the first run might take long, as the necessary dependencies (node, npm and node-webkit) are downloaded and unzipped (for mac and win). On every following run, grunt will detect that the files are already there and they won't get downloaded again.

Besides the default task, there are two more tasks available via `grunt src` and `grunt deploy`.
`grunt src` will just copy the files located in the app folder to the respective build folders. This requires that the build folder already exists, so you should have run the default task at least once before using `grunt src`.
This task is meant to speed up the development. Makes your changes in the webkit-client sources in the app folder, run `grunt src` and immediately test the changes by running the client from the build server. All steps regarding downloading, unzipping etc. are skipped, as they are not necessary for each "build".

`grunt deploy` will do the same as the default task plus some additional replacements that you would like to have in your productive version of the client, but not in the development version. At the moment
this only concerns the package.json. By default it defines that the client window will have a frame and the debug tools enabled. When running `grunt deploy` the package.json will be replaced by the package_build.json which removes the
frame and the debugging cababilities which is what you want for your productive client.

You can add the option "bridge_tag" to the manifest file package.json inside the node-webkit app to fetch a specific tag of the node server from githup for testing. You can use "master" or "local" as values.
"master" will fetch the latest server coding from the bridge repo, i.e. the last commit.
"local" will use the coding that is currently on your machine in the folder "bridge/server". 
If the tag is not present, the client will fetch the latest tag from the bridge repo, i.e. the version which is currently productive.

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
