angular.module('bridge.service').service('bridgeConfig',
    ['$http', '$window', '$log', 'bridge.service.loader', 'bridgeInstance',
    function ($http, $window, $log, bridgeLoaderServiceProvider, bridgeInstance) {

    function getAppConfig(app) {
        return app.scope ? (app.scope.box ? (app.scope.box.returnConfig ? app.scope.box.returnConfig() : app.appConfig) : {}) : {};
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
            var appConfig = {};
            try {
                appConfig = getAppConfig(visible_apps[j]);
            } catch(e) {
                $log.error("Failed to get the app-config: " + e.stack);
            }
            apps.push({
                metadata: {
                    "module_name": visible_apps[j].metadata.module_name
                },
                appConfig: appConfig
            });                        
        }
        return apps;
    }

    this.persistInBackend = function (dataService, doSynchronious) {
        var configPayload = {projects: []};
        var projects = dataService.getProjects();
        for (var i = 0; i < projects.length; i++) {
            configPayload.projects.push({ name: projects[i].name, type: projects[i].type, apps: getAppsData(projects[i]) });
        }

        configPayload.bridgeSettings = dataService.getBridgeSettings();
        delete configPayload.bridgeSettings.local;

        if (doSynchronious === true){
            // angular cannot do synchronious requests, so use jQuery here
            $.ajax(
                {
                    url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/SETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
                    type: "POST",
                    data: angular.toJson(configPayload),
                    async: false,
                    headers: { 'Content-Type': 'text/plain' },
                    success:function(){},
                    error:function(){}
                });
        } else {
            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/SETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
                method: "POST",
                data: angular.toJson(configPayload),
                headers: { 'Content-Type': 'text/plain' }
            }).success(function () {
                $log.log("Config saved successfully");
            }).error(function () {
                $log.log("Error when saving config!");
            });
        }
    };

    this.loadFromBackend = function (deferred) {
            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin),
                method: "GET"
            }).success(function (data) {
                $log.log("Config loaded successfully");
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
            ]
        };
    };
}]);
