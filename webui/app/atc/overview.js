angular.module('app.atc', ['bridge.search', 'ui.bootstrap.datepicker', 'bridge.service']);

angular.module('app.atc').directive('app.atc',
    ["app.atc.configservice", "app.atc.dataservice",
    function (appAtcConfig, appAtcData) {

    var directiveController = ['$scope', function ($scope) {
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
            if (newVal !== oldVal && oldVal !== undefined) { // this avoids the call of our change listener for the initial watch setup
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
            }
        }
    };

}]);
