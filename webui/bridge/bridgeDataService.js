angular.module('bridge.service').service('bridgeDataService', ['bridgeConfig','$q','bridge.service.loader', function (bridgeConfig, $q, bridgeLoaderService) {
    this.projects = [];
    this.bridgeSettings = {};
    this.configRawData = null;
    var that = this;

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    function _initialize(deferredIn) {
        var deferred = $q.defer();
        var promise = bridgeConfig.loadFromBackend(deferred);
        promise.then(function (config) {
            that.configRawData = config;

            // if the config is not an object, then the user has no configuration stored in the backend
            if (angular.isObject(config) && !isEmpty(config)) {
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
    }

    function parseProject(project) {
        that.projects.push({ name: project.name, type: (project.type ? project.type : 'TEAM'), apps: parseApps(project) });
    }

    function parseApps(project) {
        var apps = [];

        for (var i = 0; i < bridgeLoaderService.apps.length; i++)
        {
            //initialize metadata from loader service
            var app = {};
            app.metadata = bridgeLoaderService.apps[i];
            app.metadata.id = i; 
            app.metadata.show = false;

            //fetch corresponding config from backend
            for(var j = 0; j < project.apps.length; j++)
            {
                if(project.apps[j].metadata.module_name == app.metadata.module_name)
                {
                    app.metadata.show = true;
                    app.metadata.order = j;
                    app.appConfig = project.apps[j].appConfig;
                }
            }
            apps.push(app);    
        }

        apps.sort(function (app1, app2){
                if( app1.metadata.title < app2.metadata.title ) return -1;
                if( app1.metadata.title > app2.metadata.title ) return 1;
                return 0;
        });        
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
}]);
