angular.module('bridge.app').service('bridgeConfig', function ($http, $modal, bridgeDataService) {
    this.modalInstance = undefined;

    this.showSettingsModal = function (boxId) {
        var templateString;
        var templateController;
        var boxController;
        var boxScope;

        for (var boxProperty in bridgeDataService.boxInstances) {
            if (bridgeDataService.boxInstances[boxProperty].scope.boxId == boxId) {
                templateString = bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.templatePath;
                templateController = bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.controller;
                boxController = bridgeDataService.boxInstances[boxProperty];
                boxScope = bridgeDataService.boxInstances[boxProperty].scope;
            }
        }

        this.modalInstance = $modal.open({
            templateUrl: 'view/settings.html',
            controller: angular.module('bridge.app').settingsController,
            resolve: {
                templateString: function () {
                    return templateString;
                },
                templateController: function () {
                    return templateController;
                },
                boxController: function () {
                    return boxController;
                },
                boxScope: function () {
                    return boxScope;
                },
            }
        });

        var that = this;

        // save the config in the backend no matter if the result was ok or cancel -> we have no cancel button at the moment, but clicking on the faded screen = cancel
        this.modalInstance.result.then(function (selectedItem) {
            that.persistInBackend(bridgeDataService.boxInstances);
        }, function () {
            that.persistInBackend(bridgeDataService.boxInstances);
        });
    };
  
    this.persistInBackend = function (boxInstances) {
            this.config.boxSettings.length = 0; // clears the array without creating a new one

            for (var property in boxInstances) {
                if (angular.isFunction(boxInstances[property].scope.returnConfig)) {
                    var boxSetting = {};
                    boxSetting.boxId = boxInstances[property].scope.boxId;
                    boxSetting.setting = boxInstances[property].scope.returnConfig();

                    this.config.boxSettings.push(boxSetting);
                }
            }
            console.log(this.config);

            $http({
                url: 'https://ifp.wdf.sap.corp:443/sap/bc/devdb/SETUSRCONFIG?new_devdb=B&user_environment=&origin=' + encodeURIComponent(location.origin),
                method: "POST",
                data: angular.toJson(this.config),
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

    this.getConfigForApp = function (boxId) {
        for (var cfg in this.config.boxSettings) {
            if (boxId == this.config.boxSettings[cfg].boxId) {
                return this.config.boxSettings[cfg].setting;
            }
        }
    };

    this.config = {
            bridgeSettings: {
                                apps: []
                            },
            boxSettings: [],
    };
});