angular.module('app.atc', []);

angular.module('app.atc').directive('app.atc',
    ["$modal", "$interval", "app.atc.configservice", "app.atc.dataservice", "bridgeConfig", 
    function ($modal, $interval, appAtcConfig, appAtcData, bridgeConfig) {
    
    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "ABAP Code Check Results";
        $scope.settingsTitle = "Configure Source Systems and Packages";
        $scope.boxIcon = '&#xe05e;';
        $scope.customCSSFile = "app/atc/style.css";

        $scope.settingScreenData = {
            templatePath: "atc/settings.html",
            controller: angular.module('app.atc').appAtcSettings,
            id: $scope.boxId,
        };

        $scope.returnConfig = function () {
            return appAtcConfig;
        };

        $scope.atcData = appAtcData;
        $scope.config = appAtcConfig;
        
        //add dummy item to config
        var configItem = appAtcConfig.newItem();
        configItem.srcSystem = 'CI3';
        configItem.displayPrio1 = 'X';        
        configItem.displayPrio2 = 'X';           
        $scope.config.addConfigItem(configItem);
        console.log($scope.cofig);
        

        var loadData = function () {
            if ($scope.config.configItems.length > 0)
                $scope.atcData.getResultForConfig($scope, appAtcConfig, appAtcData);
        }

        var refreshInterval = $interval(loadData, 60000 * 5);
        $scope.$on('$destroy', function () {
            if (angular.isDefined(refreshInterval)) {
                $interval.cancel(refreshInterval);
                refreshInterval = undefined;
            }
        });

        $scope.$watch('atcData.data', function () { 
            $scope.updateATCChart($scope);
        });
        $scope.$watch('config', function () {
            loadData();
        }, true);

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
        templateUrl: 'app/atc/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            // apply persisted config to our app
            var currentConfigItem;
            var appConfig = bridgeConfig.getConfigForApp($scope.boxId);

            if (appConfig != undefined) {
                for (configItem in appConfig.configItems) {
                    currentConfigItem = new atcConfig.ConfigItem();

                    currentConfigItem.component = appConfig.configItems[configItem].component;
                    currentConfigItem.devClass = appConfig.configItems[configItem].devClass;
                    currentConfigItem.displayPrio1 = appConfig.configItems[configItem].displayPrio1;
                    currentConfigItem.displayPrio2 = appConfig.configItems[configItem].displayPrio2;
                    currentConfigItem.displayPrio3 = appConfig.configItems[configItem].displayPrio3;
                    currentConfigItem.displayPrio4 = appConfig.configItems[configItem].displayPrio4;
                    currentConfigItem.onlyInProcess = appConfig.configItems[configItem].onlyInProcess;
                    currentConfigItem.showSuppressed = appConfig.configItems[configItem].showSuppressed;
                    currentConfigItem.srcSystem = appConfig.configItems[configItem].srcSystem;
                    currentConfigItem.tadirResponsible = appConfig.configItems[configItem].tadirResponsible;

                    atcConfig.addConfigItem(currentConfigItem);
                }
            }
        }
    };

}]);