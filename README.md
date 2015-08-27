[![Build Status](https://travis-ci.mo.sap.corp/bridge/bridge.svg?token=1aixT3Ky2oME39EyWSrm&branch=master)](https://travis-ci.mo.sap.corp/bridge/bridge)
[![Commits Behind](https://bridge-master.mo.sap.corp/badge/prodstatus.svg)](https://bridge.mo.sap.corp/#/status)

[![ReviewNinja](https://github.wdf.sap.corp/bridge/bridge/raw/master/badge/wereviewninja-32.png)](https://review-ninja.mo.sap.corp/bridge/bridge)


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
* run `node server/server.js` and open `https://localhost:8000` in a browser
* for [internet explorer](http://thefunniestpictures.com/wp-content/uploads/2013/09/funny-browsers-Internet-Explorer-slow.jpg) add `https://localhost` to your trusted sites

## building apps
* apps are contained in `webui/app/appname`
* metadata for the app is defined in `_modules.json` inside that folder
* apps must be inside an own module and shoul be named/ prefixed with `app.appname`
* to get started, just copy our "test app" and adjust it
* a recording on how to develop apps can be found [here](https://sap.emea.pgiconnect.com/p3ik7dpuqve/)

Further information can be found on our [wiki page](https://github.wdf.sap.corp/bridge/bridge/wiki).

