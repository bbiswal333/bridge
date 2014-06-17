# Bridge

This is bridge, the internal Inner Source Dashboard & Platform for Developers, which is the hackable successor of the Employee Dashboard hosted on our internal GitHub instance.

* [Bridge Test](http://bridge-master.mo.sap.corp)
* [Bridge Production](http://bridge.mo.sap.corp)


# Developer Guide
Everything which is needed to is included in this repository. To get started with Git & GitHub, check out our [Bootcamp](https://github-bootcamp.mo.sap.corp). Further information can be found on our [wiki](https://github.wdf.sap.corp/bridge/bridge/wiki).

## setup
* fork this repository and clone your fork to get a local copy
* download and install `node.js` from [here](http://nodejs.org/)

## run locally
* run `node server/server.js` and open `https://localhost:8000` in a browser
* for [internet explorer](http://thefunniestpictures.com/wp-content/uploads/2013/09/funny-browsers-Internet-Explorer-slow.jpg) add `https://localhost` to your trusted sites


## building apps
* apps are contained in `webui/app/appname`
* apps must be an angluar-directive own module and shoul be named/ prefixed with `app.appname` to avoid naming collisions
* metadata for the app is defined in a file called `_modules.json`
* the app modules (plus everything mentioned in modules) is loaded during startup automatically
* to get started, just copy our "test app" and adjust it.. you should have your first app running in a few minutes
