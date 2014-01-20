Requirements a Bridge-App Must Fullfil
======================================

## General Requirements
* The app must be an angluar-directive inside it's own module
* the directive must not have an isolated scope
* the app files and folders must be kept inside it's own sub-folder of 'app'

## Obligatory $scope Properties
* boxTitle
* boxIcon
* settings = {
    templatePath: "{path to your settings template beginning with your app-folder}", // Example: testBox/TestBoxSettingsTemplate.html
    controller: {controllerObject},
    id: {YourUniqueAppId}, // the app id is available on the scope of your directive through $scope.boxId
  };