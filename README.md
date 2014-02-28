Client Installation
===============
In order to run bridge, you need to install a local client on your windows or mac machine. Other operating systems are currently not yet supported. Please contact us, if you would like to change that. Main challenges include certificate and password access and packaging of an application with installer package.
* Latest Windows Client: https://github.wdf.sap.corp/Tools/bridge-win/blob/master/setup.zip?raw=true
* Latest Mac Client: https://github.wdf.sap.corp/Tools/bridge-mac/blob/master/Bridge.app.zip?raw=true

More information about bridge are available on our [landing page](https://go.sap.corp/bridge).

Developer Guide
===============
Bridge is an internal open source project. One main goal of this is contribution and collaboration. Therefore everything which is needed to run this application is included in this project. If you want to learn more about this project and the motivation, check out this [presentation](https://github.wdf.sap.corp/pages/Tools/bridge/presentation/).

## git installation & ssh setup
* download and install `git` from [git-scm](http://git-scm.com/downloads)
  * you may want to add Git Bash to your Desktop or Taskbar
* for pushing changes to github
  * create user in GitHub and using the SAP user name
  * `$ ssh-keygen -t rsa -C "your.name@sap.com"` to generate SSH keys (private & public key)
  * copy and paste the complete content of the public key file to your github account [here](https://github.wdf.sap.corp/settings/ssh), the key title is not important
  * For Mac: copy the file content to clipboard `pbcopy < id_rsa.pub`

## setup local environment
* navigate to the bridge directory using the `$ cd c:/..` command in your terminal or git bash
* clone bridge repository via `$ git clone git@github.wdf.sap.corp:Tools/bridge.git`
  * if you need to clone via https instead and have certificate issues (error message: SSL certificate problem: unable to get local issuer certificate), please see: http://stackoverflow.com/questions/3777075/ssl-certificate-rejected-trying-to-access-github-over-https-behind-firewall
* download and install `node.js` from [here](http://nodejs.org/)
* download and install Karma with `$ npm install -g karma` if you want to execute our test suite
  * if you have issues with installing npm packages, you probably need to set the SAP Proxy for npm: `$ npm config set proxy http://proxy:8080` and `$ npm config set https-proxy http://proxy:8080`
* For Mac: Use command [sudo](http://xkcd.com/149/) to gain sufficient access rights in the command line

## launch and execute application
* in the terminal or command prompt navigate to the bridge directory using the `cd` command
* run `$ node server/server.js` and open `http://localhost:8000` in a browser

## debug node server
* use a tool like node-inspector for debugging: https://github.com/node-inspector/node-inspector
* use `$ set http_proxy=http://proxy:8080` and `$ set https_proxy=http://proxy:8080` under win to set sap proxy
* use `$ export http_proxy=http://proxy:8080` and `$ export https_proxy=http://proxy:8080` under mac to set sap proxy 
* install node inspector globally via `$ npm install -g node-inspector`
* start the node server in debug mode `$ node --debug server/server.js`
* start node inspector `$ node-inspector` in a second command line
* install the web browser [Chrome](https://www.google.com/intl/de/chrome/)
* it is recommended to also install 'AngularJS Batarang' for Chrome
* copy the URL that is displayed by node inspector into Chrome (usually that is `http://127.0.0.1:8080/debug?port=5858`)
* for full documentation and more features (automatically break in first line, attach debugger to an already running server...) see https://github.com/node-inspector/node-inspector

## auto-restarting node server
* use nodemon to automatically restart the server whenever a server file was changed: https://github.com/remy/nodemon
* install via `$ npm install -g nodemon`
* navigate to the bridge directory using the `$ cd` command
* run with `$ nodemon --debug server/server.js`

Building Apps
===============
If you want to learn how to build own apps, please read [here](BUILDING_APPS.md).

