Building Apps
======================================

## application structure
* the app must be an angluar-directive inside it's own module
* the directive must not have an isolated scope
* the app files and folders must be kept inside it's own sub-folder of 'app'

## $scope properties
```javascript

angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Test App";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;';    
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
});

```
* boxTitle: Title of the App
* boxIcon: UI5 Icon
* settingScreenData = {
    templatePath: "{path to your settings template beginning with your app-folder}", // Example: testBox/TestBoxSettingsTemplate.html
    controller: {controllerObject},
    id: {YourUniqueAppId}, // the app id is available on the scope of your directive through $scope.boxId
  };
* returnConfig = function(){}: return an object that is stored in the backend as the appConfiguration. Can be retrieved via the bridgeConfig-sevice (method: getConfigForApp(boxId)) when your app starts

## Interaction with Bridge
* use $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true }); when your app is loading data and you want the loading bar on the top of the page to indicate that. Don't forget to use
	$scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false }); when the operation is finished, otherwise the user will see the loading bar forever


## Naming convention

All services, factories and providers (actually all injectable stuff in AngularJS) share one common namespace. Furthermore we want to have (at least) one module per file, so loading order of files doesn't matter - this is important for automatic testing with Karma. Furthermore this improves reusability. Modules themself do not adress the problem of namespace-collisions, therefore we have to follow a schema when naming services etc..

## Schema for namming modules
We try to name our modules in a "Java-package-like" way:

``` app.catsMiniCal ```

In case expression would normally include a blank, a dot or a minus they are replaced by camelCase.

## Schema for naming services, factories, providers and anything else that can be injected
Because dots and minus' cannot be used for injected objects we just rely on camelCase here. 
For the reason of having unique names everywhere each injectable object should include the name of the module it is bound to.

``` angular.module("app.lunch", []).factory("appLunchWalldorf", function () {...});```

In case a module only contains one injectable object this object might have the same name as the object (obviously written differently). You might also consider writting names of directives completely in lowercase.

## Schema for test files
Test files should end up with .spec.js and should be placed close by the code they are testing.