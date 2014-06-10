# Bridge

This is bridge, the internal Inner Source Dashboard & Platform for Developers, which is the hackable successor of the Employee Dashboard hosted on our internal GitHub instance.

* [Bridge Test](http://bridge-master.mo.sap.corp)
* [Bridge Production](http://bridge.mo.sap.corp)


# Developer Guide
Everything which is needed to run this application is included in this repository. To get started with Git & GitHub, check out our [Bootcamp](https://github-bootcamp.mo.sap.corp).

## setup
* fork this repository and clone your fork to get a local copy
* download and install `node.js` from [here](http://nodejs.org/)

## run locally
* run `node server/server.js` and open `https://localhost:8000` in a browser
* for internet explorer add `https://localhost` to your trusted sites: Internet Options -> Security -> Trusted Sites -> Sites. IE does not allow cross domain calls between security zones, so you need to put localhost into the same zone as all the other https://*.wdf.sap.corp sites if you want to launch bridge from localhost. This is only relevant to bridge developers, end users do not have to do that.

## run locally with client
* you can test your app with and without the client running depending on the services and connectivity you need for you application
* if you need to adjust the client, go to the client subdirectory and execute `grunt` to rebuild the client and `grunt src` to just update the source files in the `client/app` directory
* to build a productive version of the client, run `grunt deploy`
* the local test version of the client uses the local bridge npm module on your pc and starts the node server there, the productive version downloads the latest version (git tag)
* note that at the end you will have two node servers running

## debug node server
* use a tool like node-inspector for debugging: https://github.com/node-inspector/node-inspector
* install node inspector globally via `$ npm install -g node-inspector`
* start the node server in debug mode `$ node --debug server/server.js`
* start node inspector `$ node-inspector` in a second command line
* install the web browser [Chrome](https://www.google.com/intl/de/chrome/)
* it is recommended to also install 'AngularJS Batarang' for chrome
* copy the URL that is displayed by node inspector into Chrome (usually that is `http://127.0.0.1:8080/debug?port=5858`)
* for full documentation and more features (automatically break in first line, attach debugger to an already running server...) see https://github.com/node-inspector/node-inspector

## building apps
* apps are contained in their own sub-folder `webui/app/appname`
* apps must be an angluar-directive own module and shoul be named/ prefixed with `app.appname` to avoid naming collisions
* the app directive must not have an isolated scope
* metadata for the app is defined in a file called `_modules.json`
* the app modules (plus everything mentioned in modules) is loaded during startup automatically and the app should be visibile in the settings screen
* to get started, just copy our "test app" and adjust it.. you should have your first app running in a few minutes
