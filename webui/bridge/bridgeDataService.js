angular.module('bridge.service', ['ui.bootstrap']).service('bridgeDataService', function (bridgeConfig, $q) {
    this.projects = [];
    this.bridgeSettings = {};
    this.configRawData = null;
    var that = this;

    function _initialize(deferredIn) {
        var deferred = $q.defer();
        var promise = bridgeConfig.loadFromBackend(deferred);
        promise.then(function (config) {
            that.configRawData = config;

            // if the config is not an object, then the user has no configuration stored in the backend
            if (angular.isObject(config)) {
                parseProjects(config);
                parseSettings(config);
            } else {
                _toDefault();
            }
            deferredIn.resolve();
        }, function (data) {
            deferredIn.reject(data);
        });

        return deferredIn.promise;
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

        //TODO: to be deleted, this is a transformation from the old structure to the new one
        if (config.boxSettings) {
            for (var i = 0; i < config.boxSettings.length; i++) {
                _getAppById(config.boxSettings[i].boxId).appConfig = config.boxSettings[i].setting;
            }
        }
    }

    function parseProject(project) {
        that.projects.push({ name: project.name, type: (project.type ? project.type : 'TEAM'), apps: parseApps(project) });
    }

    function parseApps(project) {
        var apps = [];
        if (project.apps) {
            for (var i = 0; i < project.apps.length; i++) {
                if (project.apps[i].metadata)
                    apps.push(project.apps[i]);
                else
                    apps.push({ metadata: project.apps[i] });

                if (apps[apps.length - 1].metadata.show === undefined)
                    apps[apps.length - 1].metadata.show = true;
            }
        }
        return apps;
    }

    function parseSettings(config) {
        if (config.bridgeSettings)
            that.bridgeSettings = config.bridgeSettings;
    }

    function _getProjects() {
        if(!that.configRawData)
            throw new Error("Bridge data not yet initialized");

        return that.projects;
    };

    function _getAppById(id) {
        if (!that.configRawData)
            throw new Error("Bridge data not yet initialized");

        for (var i = 0; i < _getProjects().length; i++) {
            for (var a = 0; a < _getProjects()[i].apps.length; a++) {
                if (_getProjects()[i].apps[a].metadata.id == id)
                    return _getProjects()[i].apps[a];
            }
        }

        throw new Error("App with ID " + id + " could not be found.");
    }

    function _getAppConfigById(id) {
        if (!that.configRawData)
            throw new Error("Bridge data not yet initialized");

        var app = _getAppById(id);
        if (app.appConfig)
            return app.appConfig;
        else
            return {};
    }

    function _toDefault() {
        that.projects.length = 0;
        var defaultConfig = bridgeConfig.getDefaultConfig();
        parseProjects(defaultConfig);
        parseSettings(defaultConfig);
    }

    function _getAppMetadataForProject(projectIndex) {
        var project = _getProjects()[projectIndex];
        if (!project)
            throw new Error("Project was not found");

        var appMetadata = [];
        for (var i = 0; i < project.apps.length; i++) {
            appMetadata.push(project.apps[i].metadata);
        }
        return appMetadata;
    }

    function _getBridgeSettings() {
        return that.bridgeSettings;
    }

    return {
        initialize: _initialize,
        getBridgeSettings: _getBridgeSettings,
        getProjects: _getProjects,
        getAppMetadataForProject: _getAppMetadataForProject,
        getAppById: _getAppById,
        getAppConfigById: _getAppConfigById,
        toDefault: _toDefault,
    };
});
