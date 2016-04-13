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
* fork this repository and clone your fork to get a local copy. (Forking means to create a copy on GitHub, and cloning means to download to your computer. Cloning can be done within the GitHub client or via [git](https://git-scm.com/downloads) on the command line.)
* [download](http://nodejs.org/) and install `node.js`

## run bridge locally
* run `npm install` -> required once after forking the repository (open a command line, navigate to your bridge folder you created in the first step and enter npm install. If you get a connection or proxy error, switch temporarily to "SAP Internet" Wifi and back to SAP Corporate when done)
* run `npm start`
* open `https://localhost:8000` in a browser
* for [internet explorer](http://thefunniestpictures.com/wp-content/uploads/2013/09/funny-browsers-Internet-Explorer-slow.jpg) add `https://localhost` to your trusted sites

## building apps
* apps are contained in `webui/app/appname` (one folder for each app).
* metadata for the app is defined in `_modules.json` inside that folder
* apps must be inside an own module and shoul be named/ prefixed with `app.appname`
* to get started, just copy our "test app" and adjust it. (After copying, replace the word "test" in all the files of the new folder with the name of your app)
* to edit your app, just do a change to one of the files with an editor of your choice (e.g. Visual Studio Code or Sublime), safe it, and refresh your browser window (F5) 
* a recording on how to develop apps can be found [here](https://sap.emea.pgiconnect.com/p3ik7dpuqve/)

## contributing
* contributions are welcome and encouraged
* contributions are managed via pull requests
* pull requests need to pass all the tests (unit tests, linting, ..)

Further information can be found on our [wiki page](https://github.wdf.sap.corp/bridge/bridge/wiki).


