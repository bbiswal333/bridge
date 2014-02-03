Requirements a Bridge-App Must Fullfil
======================================

## General Requirements
* The app must be an angluar-directive inside it's own module
* the directive must not have an isolated scope
* the app files and folders must be kept inside it's own sub-folder of 'app'

## Obligatory $scope Properties
* boxTitle
* boxIcon
* settingScreenData = {
    templatePath: "{path to your settings template beginning with your app-folder}", // Example: testBox/TestBoxSettingsTemplate.html
    controller: {controllerObject},
    id: {YourUniqueAppId}, // the app id is available on the scope of your directive through $scope.boxId
  };
* returnConfig = function(){}: return an object that is stored in the backend as the appConfiguration. Can be retrieved via the bridgeConfig-sevice (method: getConfigForApp(boxId)) when your app starts

## Interaction with Bridge
* use $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true }); when your app is loading data and you want the loading bar on the top of the page to indicate that. Don't forget to use
	$scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false }); when the operation is finished, otherwise the user will see the loading bar forever