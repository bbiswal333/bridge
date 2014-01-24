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
* loadData = function(){}: Is called for every app once the app directive is initially displayed and then whenever the refresh intervall is over. Should be used
to load at least the data that is needed for the main app-screen.
* getConfig = function(){}: return an object that is stored in the backend for the appConfiguration. Will be given to applyConfig() when bridge starts
* applyConfig = function(storedConfig){}: gives each app the config object that was stored in the backend. Set up your app in this function according to the config.

## General Behaviour
* appInitialized - Event: The app should emit this event with its boxId as the parameter once its initialization (= the fist data load) is finished.
When all apps raised this event, the initial bridge loading screen disappears.
Example: scope.$emit('appInitialized', { id: scope.boxId }); 