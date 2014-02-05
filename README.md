Developer Guide
===============
## supported operating systems
* mac
* windows


## git installation & ssh setup
* download and install `git` from [git-scm](http://git-scm.com/downloads)
  * you may want to add Git Bash to your Desktop or Taskbar
* for pushing changes to github
  * create user in GitHub and using the SAP user name
  * `$ ssh-keygen -t rsa -C "your.name@sap.com"` to generate SSH keys (private & public key)
  * copy and paste the complete content of the public key file to your github account [here](https://github.wdf.sap.corp/settings/ssh), the key title is not important

## setup local environment
* navigate to the bridge directory using the `$ cd c:/..` command
* clone bridge repository via `$ git clone git@github.wdf.sap.corp:Tools/bridge.git`
* download and install `node.js` from [here](http://nodejs.org/)
* download and install Karma with `$ npm install -g karma`

## launch and execute application
* in the command line navigate to the bridge directory using the `cd` command
* run `node server/server.js` and open `http://localhost:8000` in a browser

## debug node server
* use a tool like node-inspector for debugging: https://github.com/node-inspector/node-inspector
* use `set http_proxy=http://proxy:8080` and `set https_proxy=http://proxy:8080` under win to set sap proxy
* use `export http_proxy=http://proxy:8080` and `export https_proxy=http://proxy:8080` under mac to set sap proxy 
* install node inspector globally via `$ npm install -g node-inspector`
* start the node server in debug mode `node --debug server/server.js`
* start node inspector `node-inspector` in a second command line
* install the web browser [Chrome](https://www.google.com/intl/de/chrome/)
* it is recommended to also install 'AngularJS Batarang' for Chrome
* copy the URL that is displayed by node inspector into Chrome (usually that is `http://127.0.0.1:8080/debug?port=5858`)
* for full documentation and more features (automatically break in first line, attach debugger to an already running server...) see https://github.com/node-inspector/node-inspector

## auto-restarting node server
* use nodemon to automatically restart the server whenever a server file was changed: https://github.com/remy/nodemon
* install via `$ npm install -g nodemon`
* navigate to the bridge directory using the `cd` command
* run with `nodemon --debug server/server.js`
