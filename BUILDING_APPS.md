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
