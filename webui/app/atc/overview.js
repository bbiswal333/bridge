angular.module('app.atc', []);

angular.module('app.atc').directive('app.atc',
    ["$modal", "app.atc.configservice", "app.atc.dataservice", "bridge.search", "bridge.search.fuzzySearch",
    function ($modal, appAtcConfig, appAtcData, bridgeSearch, fuzzySearch) {

    var directiveController = ['$scope', function ($scope) {
        bridgeSearch.addSearchProvider(fuzzySearch("ATC Results", appAtcData.detailsData, {keys: ["CHECK_DESCRIPTION", "CHECK_MESSAGE"], mappingFn: function(result) {
                return {title: result.item.CHECK_MESSAGE, description: result.item.CHECK_DESCRIPTION, score: result.score};
            }
        }));

        $scope.box.settingsTitle = "Configure Source Systems and Packages";
        $scope.box.settingScreenData = {
            templatePath: "atc/settings.html",
            controller: angular.module('app.atc').appAtcSettings
        };

        $scope.box.returnConfig = function () {
            return appAtcConfig;
        };

        $scope.box.reloadApp(appAtcData.loadOverviewData,60 * 5);

        $scope.atcData = $scope.atcData || appAtcData;
        $scope.config = $scope.config || appAtcConfig;

        $scope.$watch('config', function (newVal, oldVal) {
            if (newVal !== oldVal) { // this avoids the call of our change listener for the initial watch setup
                appAtcData.loadOverviewData();
            }
        }, true);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/atc/overview.html',
        controller: directiveController,
        link: function ($scope) {
            if (appAtcConfig.isInitialized === false) {
                appAtcConfig.initialize($scope.id);
                appAtcData.loadOverviewData();
                appAtcData.getDetailsForConfig(appAtcConfig);
            }
        }
    };

}]);
