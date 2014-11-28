angular.module('bridge.service').service('bridgeConfig',
    ['$http', '$window', '$log', 'bridge.service.loader', 'bridgeInstance',
    function ($http, $window, $log, bridgeLoaderServiceProvider, bridgeInstance) {

        var storageKey = "bridgeConfig";
        var that = this;

        this.configSnapshot = null;

        function getAppConfig(app) {
            try {
                if (app.scope && angular.isFunction(app.scope.box.returnConfig)){
                    return app.scope.box.returnConfig();
                } else {
                    $log.log(app.metadata.module_name + " has no returnConfig() function.");
                    return app.appConfig;
                }
            } catch (exception){
                $log.error(exception.message);
                return app.appConfig;
            }
        }

        function getAppsData(project) {
            var visible_apps = [];
            var apps = [];

            if (project.apps) {
                for (var i = 0; i < project.apps.length; i++) {
                    if(project.apps[i].metadata.show)
                    {
                        visible_apps.push(project.apps[i]);
                    }
                }
            }

            visible_apps.sort(function(app1, app2){
                if (app1.metadata.order < app2.metadata.order) {
                    return -1;
                }
                if (app1.metadata.order > app2.metadata.order) {
                    return 1;
                }
                return 0;
            });

            for (var j = 0; j < visible_apps.length; j++)
            {
                var appConfig = getAppConfig(visible_apps[j]);

                apps.push({
                    metadata: {
                        "module_name": visible_apps[j].metadata.module_name
                    },
                    appConfig: appConfig
                });
            }
            return apps;
        }

        function isEmpty(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        }

        this.store = function(dataService) {
            if (dataService.isInitialized() === true) {
                var payload = that.constructPayload(dataService);
                $window.localStorage.setItem(storageKey, angular.toJson(payload));
            }
        };

        this.constructPayload = function(dataService){
            var configPayload = {projects: []};
            var projects = dataService.getProjects();
            for (var i = 0; i < projects.length; i++) {
                configPayload.projects.push({ name: projects[i].name, type: projects[i].type, apps: getAppsData(projects[i]) });
            }

            configPayload.bridgeSettings = dataService.getBridgeSettings();
            configPayload.savedOn = new Date();
            delete configPayload.bridgeSettings.local;

            return configPayload;
        };

        this.decideWhichConfigToUse = function(oConfigFromBackend){
            var oConfigFromStorage = that.getConfigFromStorage();

            $log.log(oConfigFromBackend.savedOn);
            if (oConfigFromStorage !== null) {
                $log.log(oConfigFromStorage.savedOn);
            } else {
                $log.log("Config from Storage was empty");
            }

            if ((!angular.isObject(oConfigFromStorage) || isEmpty(oConfigFromStorage)) && (!angular.isObject(oConfigFromBackend) || isEmpty(oConfigFromBackend))) {
                return that.getDefaultConfig(); // return default config if we have have neither backendConfig nor localConfig
            } else if (!angular.isObject(oConfigFromStorage) || isEmpty(oConfigFromStorage)){
                return oConfigFromBackend;  // use backendConfig if we have no local config
            } else if (oConfigFromBackend.savedOn > oConfigFromStorage.savedOn){
                return oConfigFromBackend;  // use config from backend if it is newer than the local config
            } else {
                return oConfigFromStorage;
            }
        };

        this.getConfigFromStorage = function(){
            var oConfigFromStorage = angular.fromJson($window.localStorage.getItem(storageKey));
            if (oConfigFromStorage !== null && oConfigFromStorage.savedOn !== null) {
                oConfigFromStorage.savedOn = new Date(oConfigFromStorage.savedOn);
            }

            //D049677: This transformation is necessary due to a previous bug in the default config
            if(oConfigFromStorage && oConfigFromStorage.bridgeSettings && angular.isArray(oConfigFromStorage.bridgeSettings.searchProvider)) {
                oConfigFromStorage.bridgeSettings.searchProvider = {};
            }

            return oConfigFromStorage;
        };

        this.persistIfThereAreChanges = function() {
            var configFromStorage = that.getConfigFromStorage();
            if ((configFromStorage !== null && configFromStorage.savedOn > that.configSnapshot.savedOn) || !that.configSnapshot.hasOwnProperty("savedOn")){
                that.persistInBackend();
                that.configSnapshot = configFromStorage;
            }
        };

        this.persistInBackend = function () {

            var sConfigPayload = $window.localStorage.getItem(storageKey);

            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/SETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
                method: "POST",
                data: sConfigPayload,
                headers: { 'Content-Type': 'text/plain' }
            }).success(function () {
                $log.log("Config saved successfully");
            }).error(function () {
                $log.log("Error when saving config!");
            });
        };

        this.loadFromBackend = function (deferred) {
                $http({
                    url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
                    method: "GET"
                }).success(function (data) {
                    $log.log("Config loaded successfully");

                    if (data.hasOwnProperty("savedOn")){
                        data.savedOn = new Date(data.savedOn);
                    }
                    deferred.resolve(data);
                }).error(function (data) {
                    $log.log("Error when loading config!");
                    deferred.reject(data);
                });

                return deferred.promise;
        };

        this.getDefaultConfig = function () {
            var apps = [];
            for (var i = 0; i < bridgeLoaderServiceProvider.apps.length; i++) {
                apps[i] = {};
                apps[i].metadata = {};
                apps[i].metadata.id = i;
                if (bridgeLoaderServiceProvider.apps[i].default_hidden) {
                    apps[i].metadata.show = false;
                }
                else {
                    apps[i].metadata.module_name = bridgeLoaderServiceProvider.apps[i].module_name;
                    apps[i].metadata.show = true;
                }
            }

            return {
                projects: [
                    {
                        name: "OVERVIEW",
                        type: "PERSONAL",
                        apps: apps
                    }
                ],
                bridgeSettings: {
                    readNews: [],
                    searchProvider: {}
                },
                savedOn: new Date(1972, 0, 1)   // the default config is "old"
            };
        };
}]);
