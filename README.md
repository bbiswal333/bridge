Bridge
======
* [Bridge Test](http://bridge-master.mo.sap.corp)
* [Bridge Production](http://bridge.mo.sap.corp)

Developer Guide
===============
Bridge is an internal open source project with the main goal of open contribution and collaboration. Therefore everything which is needed to run this application is included in this repository. We use the bridge-client repository to upload binaries of our client and the bridge-server repository for our monsoon readymade which makes it possible to setup a new bridge instance automatically in a few minutes.

## git & ssh
* download and install `git` from [git-scm](http://git-scm.com/downloads)
* for pushing changes to github
  * create a user in GitHub (you should use your SAP D/I user name)
  * run `$ ssh-keygen -t rsa -C "your.name@sap.com"` to generate SSH keys (private & public key)
  * copy and paste the complete content of the public key file to your github account [here](https://github.wdf.sap.corp/settings/ssh), the key title is not important

## setup local environment
* fork this repository and clone your fork
* download and install `node.js` from [here](http://nodejs.org/)
* optionally run `$ npm install` inside the main directory and the `client` directory if you want to do things like executing the unit tests, building the client, ..
* if you have issues with installing npm packages, you probably need to set the proxy for npm: `$ npm config set proxy http://proxy:8080` and `$ npm config set https-proxy http://proxy:8080`

## run locally
* run `$ node server/server.js` and open `https://localhost:8000` in a browser
* for IE add `https://localhost` to your trusted sites: Internet Options -> Security -> Trusted Sites -> Sites. IE does not allow cross domain calls between security zones, so you need to put localhost into the same zone as all the other https://*.wdf.sap.corp sites if you want to launch bridge from localhost. This is only relevant to bridge developers, end users do not have to do that

## run locally with client
* you can test your app with and without the client running depending on the services and connectivity you need for you application
* if you need to adjust the client, go to the client subdirectory and execute `grunt` to rebuild the client and `grunt src` to just update the source files in the `client/app` directory
* to build a productive version of the client, run `grunt deploy`
* the local test version of the client uses the local bridge npm module on your pc and starts the node server there, the productive version downloads the latest version (git tag)
* note that at the end you will have two node servers running

## debug node server
* use a tool like node-inspector for debugging: https://github.com/node-inspector/node-inspector
* install node inspector globally via `$ npm install -g node-inspector`
* start the node server in debug mode `$ node --debug server/server.js`
* start node inspector `$ node-inspector` in a second command line
* install the web browser [Chrome](https://www.google.com/intl/de/chrome/)
* it is recommended to also install 'AngularJS Batarang' for chrome
* copy the URL that is displayed by node inspector into Chrome (usually that is `http://127.0.0.1:8080/debug?port=5858`)
* for full documentation and more features (automatically break in first line, attach debugger to an already running server...) see https://github.com/node-inspector/node-inspector

Building Apps
======================================
## application structure
* apps are contained in their own sub-folder `webui/app/appname`
* apps must be an angluar-directive own module and shoul be named/ prefixed with `app.appname` to avoid naming collisions
* the app directive must not have an isolated scope
* metadata for the app is defined in a file called `_modules.json`
* the app modules (plus everything mentioned in modules) is loaded during startup automatically and the app should be visibile in the settings screen

## _modules.json
```
{
  "app":
  {
    "module_name"     : "app.test",
    "title"         : "Test App",
    "icon_css"        : "icon-lightbulb",
    "overview_directive"  : "app.test",
    "needs_client"      : false
  },
  "modules" : [],
  "js_files" : ["overview.js"],
  "css_files" : []
}
```


## overview.js
```javascript

angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', function ($scope) {
        //$scope.data = {};
        //$scope.data.test = "my test data";
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
This is just an app with no real content. Some test data: {{data.test}}.
```

