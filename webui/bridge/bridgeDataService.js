angular.module('bridge.service').service('bridgeDataService', ['bridgeConfig', '$q', '$interval', 'bridge.service.loader', '$http', '$window',
    function (bridgeConfig, $q, $interval, bridgeLoaderServiceProvider, $http, $window) {
        this.projects = [];
        this.bridgeSettings = {};
        this.temporaryData = {};
        this.clientMode = false;
        this.logMode = false;
        this.initialized = false;
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

            for (var i = 0; i < bridgeLoaderServiceProvider.apps.length; i++) {
                //initialize metadata from loader service
                var app = {};
                app.metadata = bridgeLoaderServiceProvider.apps[i];
                app.metadata.id = i;
                app.metadata.show = false;

                //fetch corresponding config from backend
                for (var j = 0; j < project.apps.length; j++) {
                    if (project.apps[j].metadata.module_name === app.metadata.module_name) {
                        app.metadata.show = true;
                        app.metadata.order = j;
                        app.appConfig = project.apps[j].appConfig;
                    }
                }
                apps.push(app);
            }

            apps.sort(function (app1, app2) {
                if (app1.metadata.title < app2.metadata.title) {
                    return -1;
                }
                if (app1.metadata.title > app2.metadata.title) {
                    return 1;
                }
                return 0;
            });
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

        function parseSettings(config) {
            if (config.bridgeSettings) {
                that.bridgeSettings = config.bridgeSettings;
            }
        }

        function _toDefault() {
            that.projects.length = 0;
            var defaultConfig = bridgeConfig.getDefaultConfig();
            parseProjects(defaultConfig);
            parseSettings(defaultConfig);

            this.initialized = true;
        }

        function _initialize(deferredIn) {
            var deferred = $q.defer();

            var configPromise = bridgeConfig.loadFromBackend(deferred);
            var userInfoPromise = _fetchUserInfo();

            var allPromises = $q.all([configPromise, userInfoPromise]);
            allPromises.then(function (data) {
                var configFromBackend = data[0];
                var config = bridgeConfig.decideWhichConfigToUse(configFromBackend);

                parseProjects(config);
                parseSettings(config);

                bridgeConfig.configSnapshot = angular.copy(config);
                $interval(bridgeConfig.persistIfThereAreChanges, 1000 * 30 );

                this.initialized = true;
                deferredIn.resolve();
            }, function (data) {
                deferredIn.reject(data);
            });

            return deferredIn.promise;
        }

        function _getProjects() {
            return that.projects;
        }

        function _getAppById(id) {
            for (var i = 0; i < _getProjects().length; i++) {
                for (var a = 0; a < _getProjects()[i].apps.length; a++) {
                    if (_getProjects()[i].apps[a].metadata.id.toString() === id.toString()) {
                        return _getProjects()[i].apps[a];
                    }
                }
            }

            throw new Error("App with ID " + id + " could not be found.");
        }

        function _getAppConfigById(id) {
            var app = _getAppById(id);
            if (app.appConfig) {
                return app.appConfig;
            } else {
                return {};
            }
        }

        function _getAppByModuleName(module_name) {
            for (var i = 0; i < _getProjects().length; i++) {
                for (var a = 0; a < _getProjects()[i].apps.length; a++) {
                    if (_getProjects()[i].apps[a].metadata.module_name.toString() === module_name.toString()) {
                        return _getProjects()[i].apps[a];
                    }
                }
            }

            throw new Error("App with module name " + module_name + " could not be found.");
        }

        function _getAppConfigByModuleName(module_name) {
            return _getAppConfigById(_getAppByModuleName(module_name).metadata.id);
        }

        function _getUserInfo() {
            return that.userInfo;
        }

        function _getAppMetadataForProject(projectIndex) {
            var project = _getProjects()[projectIndex];
            if (!project) {
                throw new Error("Project was not found");
            }

            var appMetadata = [];
            for (var i = 0; i < project.apps.length; i++) {
                appMetadata.push(project.apps[i].metadata);
            }
            return appMetadata;
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

        return {
            initialize: _initialize,
            getBridgeSettings: _getBridgeSettings,
            getTemporaryData: _getTemporaryData,
            getUserInfo: _getUserInfo,
            getProjects: _getProjects,
            getAppMetadataForProject: _getAppMetadataForProject,
            getAppById: _getAppById,
            getAppConfigById: _getAppConfigById,
            getAppConfigByModuleName: _getAppConfigByModuleName,
            toDefault: _toDefault,
            setClientMode: _setClientMode,
            getClientMode: _getClientMode,
            setLogMode: _setLogMode,
            getLogMode: _getLogMode
        };
}]);
