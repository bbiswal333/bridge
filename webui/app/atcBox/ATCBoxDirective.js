var atcApp = angular.module('atcApp', []);

atcApp.directive('atcbox', function () {

    var directiveController = ['$scope', '$modal', 'ATCDataProvider', 'Config', 'atcData', function ($scope, $modal, ATCDataProvider, Config, atcData) {
        $scope.boxTitle = "ABAP Code Check Results";
        $scope.boxIcon = '&#xe05e;';

        $scope.settingScreenData = {
            templatePath: "atcBox/ATCBoxSettingsTemplate.html",
            controller: atcApp.settingsController,
            id: $scope.boxId,
        };

        $scope.getConfig = function () {
            return Config;
        };

        $scope.applyConfig = function (storedConfig) {
            var currentConfigItem;

            for (configItem in storedConfig.configItems) {
                currentConfigItem = new ConfigItem();

                currentConfigItem.component = storedConfig.configItems[configItem].component;
                currentConfigItem.devClass = storedConfig.configItems[configItem].devClass;
                currentConfigItem.displayPrio1 = storedConfig.configItems[configItem].displayPrio1;
                currentConfigItem.displayPrio2 = storedConfig.configItems[configItem].displayPrio2;
                currentConfigItem.displayPrio3 = storedConfig.configItems[configItem].displayPrio3;
                currentConfigItem.displayPrio4 = storedConfig.configItems[configItem].displayPrio4;
                currentConfigItem.onlyInProcess = storedConfig.configItems[configItem].onlyInProcess;
                currentConfigItem.showSuppressed = storedConfig.configItems[configItem].showSuppressed;
                currentConfigItem.srcSystem = storedConfig.configItems[configItem].srcSystem;
                currentConfigItem.tadirResponsible = storedConfig.configItems[configItem].tadirResponsible;

                Config.addConfigItem(currentConfigItem);
            }
        }

        $scope.atcData = atcData;
        $scope.config = Config;

        $scope.loadData = function () {
            if (Config.configItems.length > 0)
                ATCDataProvider.getResultForConfig(Config, atcData);
        }

        $scope.$watch('atcData.data', function () { 
            $scope.updateATCChart($scope);
            $scope.initialized = true;
        });

        $scope.$watch('config.configItems', function () {
            $scope.loadData();
        });

        $scope.updateATCChart = function ($scope) {
            var chart1 = {};
            chart1.type = "PieChart";
            chart1.displayed = true;
            chart1.cssStyle = "height:150px; width:100%;";
            chart1.data = {
                "cols": [
                    { id: "month", label: "Month", type: "string" },
                    { id: "laptop-id", label: "Laptop", type: "number" },
                ], "rows": [
                    {
                        c: [
                           { v: "Prio 1 (" + $scope.atcData.data.prio1 + ")" },
                           { v: $scope.atcData.data.prio1, f: $scope.atcData.data.prio1 + " Prio 1 messages" }
                        ]
                    },
                    {
                        c: [
                           { v: "Prio 2 (" + $scope.atcData.data.prio2 + ")" },
                           { v: $scope.atcData.data.prio2, f: $scope.atcData.data.prio2 + " Prio 2 messages" }
                        ]
                    },
                    {
                        c: [
                           { v: "Prio 3 (" + $scope.atcData.data.prio3 + ")" },
                           { v: $scope.atcData.data.prio3 }
                        ]
                    },
                    {
                        c: [
                           { v: "Prio 4 (" + $scope.atcData.data.prio4 + ")" },
                           { v: $scope.atcData.data.prio4 }
                        ]
                    }
                ]
            };

            chart1.options = {
                "title": "",
                "sliceVisibilityThreshold": 0,
                "colors": ['#097AC5', '#5CCCFF', '#AFE5FF', '#E6F7FF'],
                "pieHole": 0.75,
                "fill": 20,
                "displayExactValues": false
            };

            chart1.formatters = {};

            $scope.chart = chart1;
        }
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/atcBox/ATCBoxDirective.html',
        controller: directiveController
    };

});