Bridge
======
* [Bridge Production](http://bridge.mo.sap.corp:8000/)


Client Installation
===============
In order to run bridge with all features, you need to install the local client on your machine or setup the complete developer environment.
* [Windows](https://github.wdf.sap.corp/bridge/bridge-win)
* [Mac](https://github.wdf.sap.corp/bridge/bridge-mac)

Developer Guide
===============
Bridge is an internal open source project with the main goal of open contribution and collaboration. Therefore everything which is needed to run this application is included in this project. Just fork this project, make some changes and send us a pull request.

## git installation & ssh setup
* download and install `git` from [git-scm](http://git-scm.com/downloads)
  * you may want to add Git Bash to your Desktop or Taskbar
* for pushing changes to github
  * create user in GitHub (you should use your SAP D/I user name)
  * `$ ssh-keygen -t rsa -C "your.name@sap.com"` to generate SSH keys (private & public key)
  * copy and paste the complete content of the public key file to your github account [here](https://github.wdf.sap.corp/settings/ssh), the key title is not important
  * for mac: copy the file content to clipboard `pbcopy < id_rsa.pub`

## setup local environment
* navigate to the bridge directory using the `$ cd` command in your terminal or git bash
* clone bridge repository via `$ git clone git@github.wdf.sap.corp:bridge/bridge.git`
  * if you need to clone via https instead and have certificate issues (error message: SSL certificate problem: unable to get local issuer certificate), please see: http://stackoverflow.com/questions/3777075/ssl-certificate-rejected-trying-to-access-github-over-https-behind-firewall
* download and install `node.js` from [here](http://nodejs.org/)
* download and install karma with `$ npm install -g karma` if you want to execute our test suite
  * if you have issues with installing npm packages, you probably need to set the SAP Proxy for npm: `$ npm config set proxy http://proxy:8080` and `$ npm config set https-proxy http://proxy:8080`
* for mac: use command [sudo](http://xkcd.com/149/) to gain sufficient access rights in the command line

## launch and execute application
* in the terminal or command prompt navigate to the bridge directory using the `$ cd` command
* run `$ node server/server.js` and open `http://localhost:8000` in a browser

## debug node server
* use a tool like node-inspector for debugging: https://github.com/node-inspector/node-inspector
* install node inspector globally via `$ npm install -g node-inspector`
* start the node server in debug mode `$ node --debug server/server.js`
* start node inspector `$ node-inspector` in a second command line
* install the web browser [Chrome](https://www.google.com/intl/de/chrome/)
* it is recommended to also install 'AngularJS Batarang' for chrome
* copy the URL that is displayed by node inspector into Chrome (usually that is `http://127.0.0.1:8080/debug?port=5858`)
* for full documentation and more features (automatically break in first line, attach debugger to an already running server...) see https://github.com/node-inspector/node-inspector

## auto-restarting node server
* use nodemon to automatically restart the server whenever a server file was changed: https://github.com/remy/nodemon
* install via `$ npm install -g nodemon`
* navigate to the bridge directory using the `$ cd` command
* run with `$ nodemon --debug server/server.js`

Building Apps
======================================
## application structure
* apps are contained in their own sub-folder `webui/app/appname`
* apps must be an angluar-directive named `app.appname` inside it's own module named `app.appname`
* the app directive must not have an isolated scope
* apps contain at least the files `overview.js` and `overview.html` for rendering a box on the overview page
* `$scope.boxId` is inherited from the `bridge.box` directive
* apps can optionally define settings in a separate directive

## overview.js
```javascript

angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Test App";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;'; 
        
        //optional settings screen
        $scope.settingScreenData = {
        	templatePath: "test/settings.html",
            	controller: angular.module('app.test').appTestSettings,
            	id: $scope.boxId,
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
});

```

## overview.html
```html
This is just an app with no real content. The app id is {{boxId}}.
```
## settings.js
```javascript

angular.module('app.test').appTestSettings = ['app.test.configservice', '$scope', function (appTestConfig, $scope) {
 //...
}];
```
## settings.html

Release Backlog
===============
## High Level Plan
* deadline end of CW26
* end user feedback as soon as possible
* show and tell sessions every 2 weeks
* internal pilot after "browser only" variant is ready

## Top X Apps
* Timesheet Information (CAT2) incl. maintenance
* Links (SAPGui & URL)
* Employee Search incl. SAP Connect
* Internal Messages
* Customer Messages
* IT Tickets
* Jira
* ATC
* Jenkins
* Github
* Lunch Menu
* Meetings

## Browser Only
* running version available without client on monsoon
* additional functionality with client installer

## Framework
* general settings
* projects & team views
* customizing of app order
* browser compatability incl. mobile support
* rfc calls for direct system access
* multi instance apps

## Inner Source
* sample apps & docu to jump start app development


