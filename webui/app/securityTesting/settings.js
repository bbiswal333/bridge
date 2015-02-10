angular.module('app.securityTesting').appSecurityTestingSettings =
	['$http','$scope', "app.securityTesting.configservice", function ($http, $scope, appSecurityTestingConfig) {
        var config = appSecurityTestingConfig.getConfigInstanceForAppId($scope.boxScope.metadata.guid);
        $scope.currentConfigValues = angular.copy(config);

        $scope.save_click = function () {

            var copiedConfigItem = angular.copy($scope.currentConfigValues);        			//Copy the Current input values
            config.filters = copiedConfigItem.filters;

            $scope.$emit('closeSettingsScreen');
        };//$scope.save_click

        $scope.add_click = function () {
            var a = { projectID: $scope.currentConfigValues.fortifyProject.objectid, systemType: $scope.currentConfigValues.fortifyProject.objecttype };
            $scope.currentConfigValues.filters.push(a);        			//Copy the Current input values
        };//$scope.save_click
        $scope.remove_click = function (project) {
            $scope.currentConfigValues.filters.splice($scope.currentConfigValues.filters.indexOf(project),1);        			//Copy the Current input values

        };//$scope.save_click

        function getObjectIDsForUser() {
            return $http({
                method: 'GET',
                url: 'https://pulsecsi.mo.sap.corp:1443/results/objectid/codescan/' + $scope.currentConfigValues.fortifyProject.toLowerCase(),
                withCredentials: false
            }).then(function (res) {
                    var results = [];
                    angular.forEach(res.data.details, function (item) {
                        var system = item.system;
                        if (item.system.indexOf('codescan.fortify') > -1) {
                            system = "Fortify";
                        }
                        if (item.system.indexOf('codescan.abap') > -1) {
                            system = "ABAP";
                        }
                        if (item.system.indexOf('codescan.coverity') > -1) {
                            system = "Coverity";
                        }
                        results.push({objectid: item.objectid, objecttype: system });
                    });

                    return results;
                });
        }

        $scope.getTypeaheadData = function (system) {
            return getObjectIDsForUser(system);
        };

    }];
