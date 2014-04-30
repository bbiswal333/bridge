angular.module('bridge.service').service('bridgeConfig', function ($http) {
    function getAppsData(project) {
        var apps = [];
        if (project.apps) {
            for (var i = 0; i < project.apps.length; i++) {
                apps.push({
                    metadata: project.apps[i].metadata,
                    appConfig: project.apps[i].scope ? (project.apps[i].scope.returnConfig ? project.apps[i].scope.returnConfig() : project.apps[i].appConfig) : {},
                });
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

        /*configPayload.noBackgroundImage = this.config.noBackgroundImage ? true : false;
        configPayload.boxSettings = [];

        for (var property in this.config.boxInstances) {
            if (angular.isFunction(this.config.boxInstances[property].scope.returnConfig)) {
                var boxSetting = {};
                boxSetting.boxId = this.config.boxInstances[property].scope.boxId;
                boxSetting.setting = this.config.boxInstances[property].scope.returnConfig();

                configPayload.boxSettings.push(boxSetting);
            }
        }*/

        $http({
            url: 'https://ifp.wdf.sap.corp:443/sap/bc/devdb/SETUSRCONFIG?new_devdb=B&user_environment=&origin=' + encodeURIComponent(location.origin),
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
                url: 'https://ifp.wdf.sap.corp:443/sap/bc/devdb/GETUSRCONFIG?new_devdb=B&origin=' + encodeURIComponent(location.origin),
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
        return {
            projects: [
                {
                    name: "OVERVIEW",
                    type: "PERSONAL",
                    apps: [
                        { content: "app.lunch-walldorf", id: 2, show: true },
                        { content: "app.jira", id: 3, show: true },

                        { content: "app.atc", id: 4, show: true },
                        { content: "app.employee-search", id: 5, show: true },
                        { content: "app.meetings", id: 6, show: true },

                        { content: "app.github-milestone", id: 7, show: true },
                        { content: "app.im", id: 8, show: true },
                        { content: "app.link-list", id: 9, show: true },
                        { content: "app.cats", id: 1, show: true },
                        { content: "app.sapedia", id: 12, show: true }
                    ]
                }
            ]
        };
    }
});