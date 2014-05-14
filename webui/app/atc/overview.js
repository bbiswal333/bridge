angular.module('app.atc', []);

angular.module('app.atc').directive('app.atc',
    ["$modal", "$interval", "app.atc.configservice", "app.atc.dataservice", "bridgeCounter",
    function ($modal, $interval, appAtcConfig, appAtcData, bridgeCounter) {
    
    var directiveController = ['$scope', function ($scope) {        
        $scope.box.settingsTitle = "Configure Source Systems and Packages";                
        $scope.box.settingScreenData = {
            templatePath: "atc/settings.html",
            controller: angular.module('app.atc').appAtcSettings,
            id: $scope.boxId,
        };

        $scope.box.returnConfig = function () {
            return appAtcConfig;
        };

        $scope.atcData = appAtcData;
        $scope.config = appAtcConfig;                    

        var loadData = function () {
            if ($scope.config.configItems.length > 0)
                $scope.atcData.getResultForConfig(appAtcConfig);
        }

        var refreshInterval = $interval(loadData, 60000 * 5);
        $scope.$on('$destroy', function () {
            if (angular.isDefined(refreshInterval)) {
                $interval.cancel(refreshInterval);
                refreshInterval = undefined;
            }
        });

        
        $scope.$watch('config', function () {
            loadData();
        }, true);    
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/atc/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            var currentConfigItem;

            if ($scope.appConfig != undefined) {
                appAtcConfig.clear();

                for (configItem in $scope.appConfig.configItems) {
                    currentConfigItem = new appAtcConfig.newItem();

                    currentConfigItem.component = $scope.appConfig.configItems[configItem].component;
                    currentConfigItem.devClass = $scope.appConfig.configItems[configItem].devClass;
                    currentConfigItem.displayPrio1 = $scope.appConfig.configItems[configItem].displayPrio1;
                    currentConfigItem.displayPrio2 = $scope.appConfig.configItems[configItem].displayPrio2;
                    currentConfigItem.displayPrio3 = $scope.appConfig.configItems[configItem].displayPrio3;
                    currentConfigItem.displayPrio4 = $scope.appConfig.configItems[configItem].displayPrio4;
                    currentConfigItem.onlyInProcess = $scope.appConfig.configItems[configItem].onlyInProcess;
                    currentConfigItem.showSuppressed = $scope.appConfig.configItems[configItem].showSuppressed;
                    currentConfigItem.srcSystem = $scope.appConfig.configItems[configItem].srcSystem;
                    currentConfigItem.tadirResponsible = $scope.appConfig.configItems[configItem].tadirResponsible;

                    appAtcConfig.addConfigItem(currentConfigItem);
                }
            }
        }
    };

}]);