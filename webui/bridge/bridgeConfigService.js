angular.module('bridge.service').service('bridgeConfig', ['$http', 'bridge.service.loader', 'bridgeInstance', function ($http, bridgeLoaderService, bridgeInstance) {
    function getAppsData(project) {
        var apps = [];
        if (project.apps) {
            for (var i = 0; i < project.apps.length; i++) {
                if(project.apps[i].metadata.show)
                {
                    apps.push({
                        metadata: {
                            "module_name": project.apps[i].metadata["module_name"]
                        },
                        appConfig: project.apps[i].scope ? (project.apps[i].scope.returnConfig ? project.apps[i].scope.returnConfig() : project.apps[i].appConfig) : {},
                    });
                }
            }
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
        for( var i = 0; i < bridgeLoaderService.apps.length; i++)
        {
            apps[i] = {};
            apps[i].metadata = {};
            apps[i].metadata['module_name'] = bridgeLoaderService.apps[i]['module_name'];
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