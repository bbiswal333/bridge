angular.module('bridge.service').service('bridgeDataService', ['bridgeConfig', '$q', '$interval', 'bridge.service.loader', '$http', '$window', "bridge.service.appCreator", "bridgeInBrowserNotification", "bridgeUserData",
    function (bridgeConfig, $q, $interval, bridgeLoaderServiceProvider, $http, $window, appCreator, bridgeInBrowserNotification, bridgeUserData) {
        this.projects = [];
        this.bridgeSettings = {};
        this.temporaryData = {};
        this.clientMode = false;
        this.logMode = false;
        this.availableApps = [];
        var viewPromises = [];

        var initialized = false;
        var that = this;

        var userInfo;

        var selectedProject;
        function _setSelectedProject(project) {
            selectedProject = project;
        }

        function _getSelectedProject() {
            return selectedProject;
        }

        function _getProject(id) {
            var result;
            that.projects.map(function(project) {
                if(project.view === id) {
                    result = project;
                }
            });
            return result;
        }

        function _hasProject(id) {
            if(_getProject(id) !== undefined) {
                return true;
            } else {
                return false;
            }
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

        function getProjectDataFromBackend(project) {
            var deferred = $q.defer();
            bridgeConfig.getTeamConfig(project.view).then(function(data) {
                if(data.error) {
                    bridgeInBrowserNotification.addAlert("danger", "View could not be loaded: " + project.name + ". Error: " + data.message, 600);
                    that.projects.splice(that.projects.indexOf(project), 1);
                    deferred.reject();
                } else {
                    project.name = data.name;
                    project.apps = parseApps(data);
                    deferred.resolve(project);
                }
            }, function(error) {
                bridgeInBrowserNotification.addAlert("danger", "View could not be loaded: " + project.name + ". Error: " + error.message, 600);
                that.projects.splice(that.projects.indexOf(project), 1);
                deferred.reject();
            });
            return deferred.promise;
        }

        function parseProject(project) {
            var deferred;
            var projectObject = { name: project.name, type: (project.type ? project.type : 'TEAM') };
            if(projectObject.type === "TEAM") {
                projectObject.view = project.view;
                projectObject.owner = project.owner;
                projectObject.apps = [];
                deferred = getProjectDataFromBackend(projectObject);
            } else {
                projectObject.owner = userInfo ? userInfo.BNAME : "";
                projectObject.apps = parseApps(project);
            }
            that.projects.push(projectObject);
            if(deferred) {
                return deferred;
            }
        }

        function parseProjects(config) {
            viewPromises = [];
            var promise;
            if (config.bridgeSettings && config.bridgeSettings.apps) {
                promise = parseProject({ name: "OVERVIEW", type: "PERSONAL", apps: config.bridgeSettings.apps });
                if(promise) {
                    viewPromises.push(promise);
                }
            }
            else if (config.projects) {
                for (var i = 0; i < config.projects.length; i++) {
                    promise = parseProject(config.projects[i]);
                    if(promise) {
                        viewPromises.push(promise);
                    }
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

        function _setDataFromConfig(oConfigData) {
            _removeAllApps();
            that.projects.length = 0;

            parseProjects(oConfigData);
            parseSettings(oConfigData);

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
            var userInfoPromise = bridgeUserData.getUserData();

            userInfoPromise.then(function(data) {
                userInfo = data;
            });

            function assignConfig(oConfigFromBackend){
                initializeAvailableApps();
                var config = bridgeConfig.decideWhichConfigToUse(oConfigFromBackend);

                parseProjects(config);
                parseSettings(config);

                bridgeConfig.configSnapshot = angular.copy(config);
                $interval(bridgeConfig.persistIfThereAreChanges, 1000 * 30 );

                $q.all(viewPromises).then(function() {
                    initialized = true;
                });
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

        function _addProject(view) {
            var alreadyAdded = false;
            _getProjects().map(function(project) {
                if(project.type === 'TEAM' && project.view === view) {
                    alreadyAdded = true;
                }
            });

            if(alreadyAdded === true) {
                bridgeInBrowserNotification.addAlert("danger", "This view was already added.", 600);
            } else {
                return parseProject({name: "", type: 'TEAM', view: view});
            }
        }

        function _getUserInfo() {
            return userInfo;
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

        function _getInstancesByType(type) {
            var apps = [];
            _getSelectedProject().apps.map(function(app) {
                if(app.metadata.module_name === type) {
                    apps.push(app);
                }
            });
            return apps;
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
            getAvailableApps: _getAvailableApps,
            setSelectedProject: _setSelectedProject,
            getSelectedProject: _getSelectedProject,
            hasProject: _hasProject,
            getProject: _getProject,
            addProject: _addProject,
            getInstancesByType: _getInstancesByType,
            setDataFromConfig: _setDataFromConfig
        };
}]);
