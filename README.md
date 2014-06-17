# Bridge

This is **Bridge**, the internal Inner Source Dashboard & Platform for Developers, 
which is the **hackable successor of the Employee Dashboard** hosted on our internal GitHub instance. 
To **use it**, visit our test or production instance links below. 
To **enhance it**, just follow the instructions on this page.
To get started with **Git & GitHub**, check out the [Bootcamp](https://github-bootcamp.mo.sap.corp). 

* [Bridge Test](http://bridge-master.mo.sap.corp)
* [Bridge Production](http://bridge.mo.sap.corp)

## development setup
* fork this repository and clone your fork to get a local copy
* [download](http://nodejs.org/) and install `node.js`

## run bridge locally
* run `node server/server.js` and open `https://localhost:8000` in a browser
* for [internet explorer](http://thefunniestpictures.com/wp-content/uploads/2013/09/funny-browsers-Internet-Explorer-slow.jpg) add `https://localhost` to your trusted sites

## building apps
* apps are contained in `webui/app/appname`
* metadata for the app is defined in `_modules.json` inside that folder
* apps must be inside an own module and shoul be named/ prefixed with `app.appname`
* to get started, just copy our "test app" and adjust it

Further information can be found on our [wiki](https://github.wdf.sap.corp/bridge/bridge/wiki).
