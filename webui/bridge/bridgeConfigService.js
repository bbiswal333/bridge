angular.module('bridge.service').service('bridgeConfig', ['$http', 'bridge.service.loader', 'bridgeInstance', function ($http, bridgeLoaderServiceProvider, bridgeInstance) {
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
            if (app1.metadata.order < app2.metadata.order) return -1;
            if (app1.metadata.order > app2.metadata.order) return 1;
            return 0;
        });
        
        for (var i = 0; i < visible_apps.length; i++) 
        {
            apps.push({
                metadata: {
                    "module_name": visible_apps[i].metadata["module_name"]
                },
                appConfig: visible_apps[i].scope ? (visible_apps[i].scope.box ? (visible_apps[i].scope.box.returnConfig ? visible_apps[i].scope.box.returnConfig() : visible_apps[i].appConfig) : {}) : {},
            });                        
        }
        return apps;
    }

    this.persistInBackend = function (dataService) {
        var configPayload = {projects: []};
        var projects = dataService.getProjects();
        for (var i = 0; i < projects.length; i++) {
            configPayload.projects.push({ name: projects[i].name, type: projects[i].type, apps: getAppsData(projects[i]) });
        }

        configPayload.bridgeSettings = dataService.getBridgeSettings();

        $http({
            url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/SETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent(location.origin),
            method: "POST",
        data: angular.toJson(configPayload),
            headers: { 'Content-Type': 'text/plain' },
        }).success(function (data, status, headers, config) {
            console.log("Config saved successfully");
        }).error(function (data, status, headers, config) {
            console.log("Error when saving config!");
        });
    };

    this.loadFromBackend = function (deferred) {
            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GETUSERCONFIG?instance=' + bridgeInstance .getCurrentInstance()+ '&origin=' + encodeURIComponent(location.origin),
                method: "GET",
            }).success(function (data, status, headers, config) {
                console.log("Config loaded successfully");
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                console.log("Error when loading config!");
                deferred.reject(data);
            });

            return deferred.promise;
    };

    this.getDefaultConfig = function () {
        var apps = [];       
        for( var i = 0; i < bridgeLoaderServiceProvider.apps.length; i++)
        {
            apps[i] = {};
            apps[i].metadata = {};
            apps[i].metadata['module_name'] = bridgeLoaderServiceProvider.apps[i]['module_name'];
            apps[i].metadata.id = i;
            apps[i].metadata.show = true;
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
    }
}]);