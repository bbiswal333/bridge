bridgeApp.factory('bridgeConfigService', function ($http) {
    return {
        persistInBackend: function (boxInstances) {
            this.config.boxSettings.length = 0; // clears the array without creating a new one

            for (var property in boxInstances) {
                if (angular.isFunction(boxInstances[property].scope.getConfig)) {
                    var boxSetting = {};
                    boxSetting.boxId = boxInstances[property].scope.boxId;
                    boxSetting.setting = boxInstances[property].scope.getConfig();

                    this.config.boxSettings.push(boxSetting);
                }
            }

            $http({
                url: 'http://localhost:8000/api/post?url=' + encodeURIComponent('https://ifd.wdf.sap.corp:443/sap/bc/devdb/SETUSRCONFIG?new_devdb=B&user_environment='),
                method: "POST",
                data: angular.toJson(this.config),
                headers: { 'Content-Type': 'text/plain' },
            }).success(function (data, status, headers, config) {
                console.log("Config saved successfully");
            }).error(function (data, status, headers, config) {
                console.log("Error when saving config!");
            });

        },

        loadFromBackend: function (deferred) {
            $http({
                url: 'http://localhost:8000/api/get?url=' + encodeURIComponent('https://ifd.wdf.sap.corp:443/sap/bc/devdb/GETUSRCONFIG?new_devdb=B'),
                method: "GET",
            }).success(function (data, status, headers, config) {
                console.log("Config loaded successfully");
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                console.log("Error when loading config!");
                deferred.reject(data);
            });

            return deferred.promise;
        },

        applyConfigToApps: function (boxInstances, config) {
            for (var box in boxInstances) {
                if (angular.isFunction(boxInstances[box].scope.applyConfig)) {
                    var correspondingConfig;

                    for (var cfg in config.boxSettings) {
                        if (boxInstances[box].scope.boxId == config.boxSettings[cfg].boxId) {
                            correspondingConfig = config.boxSettings[cfg].setting;
                            boxInstances[box].scope.applyConfig(correspondingConfig);
                            break;
                        }
                    }
                }
            }
        },

        config: {
            bridgeSettings: {},
            boxSettings: [],
        },
    };
});