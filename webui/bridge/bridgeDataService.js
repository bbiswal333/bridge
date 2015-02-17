angular.module('bridge.service').service('bridgeDataService', ['bridgeConfig', '$q', '$interval', 'bridge.service.loader', '$http', '$window', "bridge.service.appCreator", "bridgeInBrowserNotification",
    function (bridgeConfig, $q, $interval, bridgeLoaderServiceProvider, $http, $window, appCreator, bridgeInBrowserNotification) {
        this.projects = [];
        this.bridgeSettings = {};
        this.temporaryData = {};
        this.clientMode = false;
        this.logMode = false;
        this.availableApps = [];

        var initialized = false;
        var that = this;

        function _fetchUserInfo() {
            var defer = $q.defer();

            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_MY_DATA?origin=' + encodeURIComponent($window.location.origin),
                method: "GET"
            }).success(function (data) {
                that.userInfo = data.USERINFO;
                defer.resolve();
            }).error(function(){
                defer.reject();
            });

            return defer.promise;
        }

        function parseApps(project) {
            var apps = [];

            for (var j = 0; j < project.apps.length; j++) {
                try {
                    var app = appCreator.createInstance(project.apps[j].metadata, project.apps[j].appConfig);
                    apps.push(app);
                } catch(e) {
                    bridgeInBrowserNotification.addAlert("danger", e.message, 600);
                }
            }

            return apps;
        }

        function parseProject(project) {
            that.projects.push({ name: project.name, type: (project.type ? project.type : 'TEAM'), apps: parseApps(project) });
        }

        function parseProjects(config) {
            if (config.bridgeSettings && config.bridgeSettings.apps) {
                parseProject({ name: "OVERVIEW", type: "PERSONAL", apps: config.bridgeSettings.apps });
            }
            else if (config.projects) {
                for (var i = 0; i < config.projects.length; i++) {
                    parseProject(config.projects[i]);
                }
            }
        }

        function extractWeatherConfigFromOldWeatherAppIfAvailable(config) {
            if(config.projects && config.projects.length > 0) {
                var project = config.projects[0];
                for(var i = 0, length = project.apps.length; i < length; i++) {
                    if(project.apps[i].metadata.module_name === "app.weather") {
                        that.bridgeSettings.weatherConfig = project.apps[i].appConfig;
                    }
                }
            }
        }

        function parseSettings(config) {
            //take over weather from weather app
            extractWeatherConfigFromOldWeatherAppIfAvailable(config);

            if (config.bridgeSettings) {
                that.bridgeSettings = config.bridgeSettings;
            }
        }

        function _removeAllApps() {
            that.projects.map(function(project) {
                project.apps.map(function(app) {
                    appCreator.removeInstanceById(app.metadata.guid);
                });
            });
        }
        function _toDefault() {
            _removeAllApps();
            that.projects.length = 0;
            var defaultConfig = bridgeConfig.getDefaultConfig();
            parseProjects(defaultConfig);
            parseSettings(defaultConfig);

            initialized = true;
        }

        function initializeAvailableApps() {
            bridgeLoaderServiceProvider.apps.map(function(app) {
                that.availableApps.push(app);

            });
            that.availableApps.sort(function (app1, app2) {
                if (app1.title < app2.title) {
                    return -1;
                }
                if (app1.title > app2.title) {
                    return 1;
                }
                return 0;
            });
        }

        var deferrals = [];
        function _initialize(deferredIn) {
            deferrals.push(deferredIn);
            if(deferrals.length > 1) {
                //initialization was already started
                return deferredIn.promise;
            }

            var deferred = $q.defer();

            var configPromise = bridgeConfig.loadFromBackend(deferred);
            var userInfoPromise = _fetchUserInfo();

            function assignConfig(oConfigFromBackend){
                initializeAvailableApps();
                var config = bridgeConfig.decideWhichConfigToUse(oConfigFromBackend);

                parseProjects(config);
                parseSettings(config);

                bridgeConfig.configSnapshot = angular.copy(config);
                $interval(bridgeConfig.persistIfThereAreChanges, 1000 * 30 );

                initialized = true;
            }

            var allPromises = $q.all([configPromise, userInfoPromise]);
            allPromises.then(function (data) {
                assignConfig(data[0]);
                deferrals.map(function(deferral) {
                    deferral.resolve();
                });
            }, function () {
                assignConfig(null);
                var initializationResult = { bBackendCallFailed: true };
                deferrals.map(function(deferral) {
                    deferral.resolve(initializationResult);
                });
            });

            return deferredIn.promise;
        }

        function _getProjects() {
            return that.projects;
        }

        function _getAppLocationById(id) {
            for (var i = 0; i < _getProjects().length; i++) {
                for (var a = 0; a < _getProjects()[i].apps.length; a++) {
                    if (_getProjects()[i].apps[a].metadata.guid.toString() === id.toString()) {
                        return {projectIndex: i, appIndex: a};
                    }
                }
            }

            throw new Error("App with ID " + id + " could not be found.");
        }

        function _getAppById(id) {
            var appLocation = _getAppLocationById(id);
            return _getProjects()[appLocation.projectIndex].apps[appLocation.appIndex];
        }

        function _removeAppById(id) {
            appCreator.removeInstanceById(id);
            var appLocation = _getAppLocationById(id);
            return _getProjects()[appLocation.projectIndex].apps.splice(appLocation.appIndex, 1);
        }

        function _getAppConfigById(id) {
            var app = _getAppById(id);
            if (app.appConfig) {
                return app.appConfig;
            } else {
                return {};
            }
        }

        function _getUserInfo() {
            return that.userInfo;
        }

        function _getBridgeSettings() {
            return that.bridgeSettings;
        }

        function _getTemporaryData() {
            return that.temporaryData;
        }

        function _setClientMode(bClientMode) {
            this.clientMode = bClientMode;
        }

        function _getClientMode() {
            return this.clientMode;
        }

        function _setLogMode(bLogMode) {
            this.logMode = bLogMode;
        }

        function _getLogMode() {
            return this.logMode;
        }

        function _getInitialized() {
            return initialized;
        }

        function _getAvailableApps() {
            return that.availableApps;
        }

        return {
            initialize: _initialize,
            isInitialized: _getInitialized,
            getBridgeSettings: _getBridgeSettings,
            getTemporaryData: _getTemporaryData,
            getUserInfo: _getUserInfo,
            getProjects: _getProjects,
            getAppById: _getAppById,
            removeAppById: _removeAppById,
            getAppConfigById: _getAppConfigById,
            toDefault: _toDefault,
            setClientMode: _setClientMode,
            getClientMode: _getClientMode,
            setLogMode: _setLogMode,
            getLogMode: _getLogMode,
            getAvailableApps: _getAvailableApps
        };
}]);
