[![Build Status](https://travis-ci.mo.sap.corp/bridge/bridge.svg?token=KH6hrCs1L1tPTHXVpuXy&branch=master)](https://travis-ci.mo.sap.corp/bridge/bridge)
[![Commits Behind](https://bridge-master.mo.sap.corp/badge/prodstatus.svg)](https://bridge.mo.sap.corp/#/status)
[![ReviewNinja](https://review-ninja.mo.sap.corp/2417/badge)](https://review-ninja.mo.sap.corp/bridge/bridge)


# Bridge

This is **Bridge**, the internal Inner Source Dashboard & Platform for Developers, 
which is the **hackable successor of the Employee Dashboard** hosted on our internal GitHub instance. 
To **use it**, visit our test or production instance links below. 
To **enhance it**, just follow the instructions on this page.
To get started with **Git & GitHub**, check out the [Bootcamp](https://github-bootcamp.mo.sap.corp). 

* [Bridge Test](https://bridge-master.mo.sap.corp)
* [Bridge Production](https://bridge.mo.sap.corp)

## development setup
* fork this repository and clone your fork to get a local copy
* [download](http://nodejs.org/) and install `node.js`

## run bridge locally
* run `npm install` -> required once after forking the repository
* run `npm start`
* open `https://localhost:8000` in a browser
* for [internet explorer](http://thefunniestpictures.com/wp-content/uploads/2013/09/funny-browsers-Internet-Explorer-slow.jpg) add `https://localhost` to your trusted sites

## building apps
* apps are contained in `webui/app/appname`
* metadata for the app is defined in `_modules.json` inside that folder
* apps must be inside an own module and shoul be named/ prefixed with `app.appname`
* to get started, just copy our "test app" and adjust it
* a recording on how to develop apps can be found [here](https://sap.emea.pgiconnect.com/p3ik7dpuqve/)

## contributing
* contributions are welcome and encouraged
* contributions are managed via pull requests
* pull requests need to pass all the tests (unit tests, linting, ..)

Further information can be found on our [wiki page](https://github.wdf.sap.corp/bridge/bridge/wiki).


