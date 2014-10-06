angular.module('app.getHome', []);
angular.module('app.getHome').directive('app.getHome', [ 'app.getHome.configservice', 'app.getHome.mapservice', 'bridgeDataService', 'bridgeConfig', '$location', function (appGetHomeConfig, appGetHomeMap) {

	var directiveController = ['$scope', function ($scope)
	{
		$scope.box.boxSize = "2";
		$scope.box.settingScreenData = {
			templatePath: "getHome/settings.html",
			controller: angular.module('app.getHome').appGetHomeSettings
		};
		$scope.formatTime = appGetHomeMap.formatTime;
		$scope.formatDistance = appGetHomeMap.formatDistance;
		$scope.routes = appGetHomeConfig.routes;

		$scope.box.returnConfig = function () {
			return appGetHomeConfig.routes;
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/getHome/overview.html',
		controller: directiveController,
		link: function($scope) {

			if ($scope.appConfig !== undefined && !angular.equals({}, $scope.appConfig) && appGetHomeConfig.routes.length === 0) {
				$scope.appConfig.map(function(configItem) {
					var routeItem = JSON.parse(configItem);
					appGetHomeConfig.addRouteFromConfig(routeItem);
				});
			}
		}
	};
}]);
