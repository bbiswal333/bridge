Bridge
======
* [Bridge Test](http://bridge-master.mo.sap.corp)
* [Bridge Production](http://bridge.mo.sap.corp)

Developer Guide
===============
Bridge is an internal open source project with the main goal of open contribution and collaboration. Therefore everything which is needed to run this application is included in this repository. The server and client repository are just wrapping this repository (which is a npm module), deploy it and provide some update functionality around that. To contribute, just fork this project, make some changes and send us a pull request. 

## git installation & ssh setup
* download and install `git` from [git-scm](http://git-scm.com/downloads)
  * you may want to add git bash to your desktop or taskbar
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
* run `$ node server/server.js` and open `https://localhost:1972` in a browser
* if you try to launch the app in IE, first add `https://localhost` to your trusted sites: Internet Options -> Security -> Trusted Sites -> Sites. IE does not allow cross domain calls between security zones, so you need to put localhost into the same zone as all the other https://*.wdf.sap.corp sites if you want to launch bridge from localhost. This is only relevant to bridge developers, end users do not have to do that.

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
  * your app module must be loaded by the main-module. To do this, reference your module in bridgeController.js
* the app directive must not have an isolated scope
* apps contain at least the files `overview.js` and `overview.html` for rendering a box on the overview page
  * your overview.js must be loaded via `<script>` tag in the index.html
* `$scope.boxId` is inherited from the `bridge.box` directive
* apps can optionally define settings in a separate directive
* to make your app visible, you have to add it to the default config in sortableService.js and reset your config via debug.resetConfig() in your Browser's console. This step is a workaround at the moment and will be obsolete in the future.


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

## Framework
* general settings
* projects & team views
* customizing of app order
* browser compatability incl. mobile support
* rfc calls for direct system access
* multi instance apps

## Inner Source
* sample apps & docu to jump start app development

