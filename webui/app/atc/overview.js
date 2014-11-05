﻿angular.module('app.atc', ['bridge.search']);

angular.module('app.atc').directive('app.atc',
    ["app.atc.configservice", "app.atc.dataservice", "bridge.search", "bridge.search.fuzzySearch",
    function (appAtcConfig, appAtcData, bridgeSearch, fuzzySearch) {

    var directiveController = ['$scope', function ($scope) {
        bridgeSearch.addSearchProvider(fuzzySearch({name: "ATC Results", icon: "icon-wrench"}, appAtcData.detailsData, {keys: ["CHECK_DESCRIPTION", "CHECK_MESSAGE"], mappingFn: function(result) {
                return {title: result.item.CHECK_MESSAGE, description: result.item.CHECK_DESCRIPTION, score: result.score};
            }
        }));

        $scope.box.settingsTitle = "Configure Source Systems and Packages";
        $scope.box.settingScreenData = {
            templatePath: "atc/settings.html",
            controller: angular.module('app.atc').appAtcSettings
        };

        $scope.box.returnConfig = function () {
            return appAtcConfig.getConfigForAppId($scope.metadata.guid);
        };

        $scope.box.reloadApp(appAtcData.loadOverviewData,60 * 5);

        $scope.atcData = $scope.atcData || appAtcData.getInstanceForAppId($scope.metadata.guid);
        $scope.config = $scope.config || appAtcConfig.getConfigForAppId($scope.metadata.guid);

        $scope.$watch('config', function (newVal, oldVal) {
            if (newVal !== oldVal) { // this avoids the call of our change listener for the initial watch setup
                appAtcData.getInstanceForAppId($scope.metadata.guid).loadOverviewData();
            }
        }, true);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/atc/overview.html',
        controller: directiveController,
        link: function ($scope) {
            if (appAtcConfig.getConfigForAppId($scope.metadata.guid).isInitialized === false) {
                appAtcConfig.getConfigForAppId($scope.metadata.guid).initialize($scope.metadata.guid);
                appAtcData.getInstanceForAppId($scope.metadata.guid).loadOverviewData();
                appAtcData.getInstanceForAppId($scope.metadata.guid).getDetailsForConfig(appAtcConfig.getConfigForAppId($scope.metadata.guid));
            }
        }
    };

}]);
