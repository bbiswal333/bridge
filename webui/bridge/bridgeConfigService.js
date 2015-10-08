angular.module('bridge.service').service('bridgeConfig',
    ['$http', '$window', '$log', 'bridge.service.loader', 'bridgeInstance', '$q',
    function ($http, $window, $log, bridgeLoaderServiceProvider, bridgeInstance, $q) {

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

        function getOnlyChangedMetadata(metadata) {
            var cleanedMetadata = {};
            var originalMetadata = bridgeLoaderServiceProvider.findAppByModuleName(metadata.module_name);
            for (var prop in metadata) {
                if(originalMetadata[prop] === undefined || JSON.stringify(metadata[prop]) !== JSON.stringify(originalMetadata[prop]) || prop === "module_name" || prop === "guid") {
                    cleanedMetadata[prop] = metadata[prop];
                }
            }
            return cleanedMetadata;
        }

        function getAppsData(project) {
            return project.apps.map(function(app) {
                return {
                    metadata: getOnlyChangedMetadata(app.metadata),
                    appConfig: getAppConfig(app)
                };
            });
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
                $log.log("Config saved successfully in localStorage");
            }
        };

        this.constructPayload = function(dataService){
            var configPayload = {projects: []};
            var projects = dataService.getProjects();
            for (var i = 0; i < projects.length; i++) {
                if(projects[i].type === "TEAM") {
                    configPayload.projects.push({ name: projects[i].name, type: projects[i].type, owner: projects[i].owner, view: projects[i].view });
                } else {
                    configPayload.projects.push({ name: projects[i].name, type: projects[i].type, apps: getAppsData(projects[i]) });
                }
            }

            configPayload.bridgeSettings = dataService.getBridgeSettings();
            configPayload.savedOn = new Date();
            delete configPayload.bridgeSettings.local;

            return configPayload;
        };

        this.decideWhichConfigToUse = function(oConfigFromBackend){
            var oConfigFromStorage = that.getConfigFromStorage();

            if (oConfigFromStorage !== null) {
                $log.log(oConfigFromStorage.savedOn);
            } else {
                $log.log("Config from Storage was empty");
            }

            if ((!angular.isObject(oConfigFromStorage) || isEmpty(oConfigFromStorage)) && (!angular.isObject(oConfigFromBackend) || isEmpty(oConfigFromBackend))) {
                return that.getDefaultConfig(); // return default config if we have have neither backendConfig nor localConfig
            } else if (!angular.isObject(oConfigFromStorage) || isEmpty(oConfigFromStorage)){
                return oConfigFromBackend;  // use backendConfig if we have no local config
            } else if (oConfigFromBackend !== null && oConfigFromBackend.savedOn > oConfigFromStorage.savedOn){
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
                url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/SETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
                method: "POST",
                data: sConfigPayload,
                headers: { 'Content-Type': 'text/plain' }
            }).success(function () {
                $log.log("Config saved successfully in backend");
            }).error(function () {
                $log.log("Error when saving config! in backend");
            });
        };

        this.loadFromBackend = function (deferred) {
                $http({
                    url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/GETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
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
                if(!bridgeLoaderServiceProvider.apps[i].default_hidden) {
                    apps.push({metadata: bridgeLoaderServiceProvider.apps[i]});
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

        this.getTeamConfig = function(owner, view) {
            var deferred = $q.defer();
            $http.get('https://ifd.wdf.sap.corp/sap/bc/bridge/GET_VIEW?view=' + view + '&owner=' + owner + '&instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin)).success(function(data) {
                if(data.error) {
                    return deferred.reject(data);
                }
                deferred.resolve(data);
            }).error(function(data) {
                $log.log("Error loading team data!");
                deferred.reject(data);
            });
            return deferred.promise;
        };
}]);
