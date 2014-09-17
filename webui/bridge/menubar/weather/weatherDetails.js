angular.module('bridge.app').directive('bridge.menubar.weather', ['app.weather.configservice', 'bridgeDataService', 'bridgeConfig', function (weatherconfig, bridgeDataService, bridgeConfig) {

    var directiveController = ['$scope', '$http', 'bridgeDataService', function ($scope, $http, bridgeDataService)
    {
    	$scope.box.boxSize = "1";
        $scope.box.settingsTitle = "Configure temparature scale and location";
        $scope.box.settingScreenData = {
            templatePath: "weather/settings.html",
            controller: angular.module('app.weather').appWeatherSettings
        };

        $scope.configService = weatherconfig;
        $scope.box.returnConfig = function(){
            return angular.copy($scope.configService);
        };
}];

return {
    restrict: 'E',
    templateUrl: 'app/weather/overview.html',
    controller: directiveController,
    link: function ($scope)
        {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem)
            {
                weatherconfig.configItem = $scope.appConfig.configItem;
            }
            else
            {
                weatherconfig.init().then( function(){ bridgeConfig.store(bridgeDataService); } );
            }
        }
    };
}]);
