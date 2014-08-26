angular.module('app.atc', []);

angular.module('app.atc').directive('app.atc',
    ["$modal", "$interval", "app.atc.configservice", "app.atc.dataservice",
    function ($modal, $interval, appAtcConfig, appAtcData) {
    
    var directiveController = ['$scope', function ($scope) {        
        $scope.box.settingsTitle = "Configure Source Systems and Packages";                
        $scope.box.settingScreenData = {
            templatePath: "atc/settings.html",
            controller: angular.module('app.atc').appAtcSettings
        };

        $scope.box.returnConfig = function () {
            return appAtcConfig;
        };

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
            }
        }
    };

}]);
