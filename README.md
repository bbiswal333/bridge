Developer Guide
===============

## git installation & ssh setup
* download and install `git` from [git-scm](http://git-scm.com/downloads)
* for pushing changes to github
  * run `ssh-keygen -t rsa -C "your.name@sap.com"` to generate SSH keys (private & public key)
  * copy and paste the public key to your github account [here](https://github.wdf.sap.corp/settings/ssh)

## setup local environment
* clone bridge repository via `git clone git@github.wdf.sap.corp:Tools/bridge.git`
* download and install `node.js` from [here](http://nodejs.org/)

## launch and execute application
* run `node server/server.js` and open `http://localhost:8000`

## debug node server
* use a tool like node-inspector for debugging: https://github.com/node-inspector/node-inspector
* install node inspector globally via `npm install -g node-inspector`
* start the node server in debug mode `node --debug server/server.js`
* start node inspector `node-inspector`
* copy the URL that is displayed by node inspector into Chrome (usually that is `http://127.0.0.1:8080/debug?port=5858`)
* for full documentation and more features (automatically break in first line, attach debugger to an already running server...) see https://github.com/node-inspector/node-inspector

## auto-restarting node server
* use nodemon to automatically restart the server whenever a server file was changed: https://github.com/remy/nodemon
* install via `npm install -g nodemon` and run with `nodemon server/server.js`