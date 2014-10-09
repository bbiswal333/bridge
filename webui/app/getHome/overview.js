/*global nokia*/
angular.module('app.getHome', []);
angular.module('app.getHome').directive('app.getHome', [ 'app.getHome.configservice', 'app.getHome.mapservice', '$modal', '$interval', function (appGetHomeConfig, appGetHomeMap, $modal, $interval) {

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

		$scope.openRouteDetails = function(route) {
            $modal.open({
              templateUrl: 'app/getHome/detail.html',
              controller: function($scope) {
              	$scope.route = route;
              	$scope.formatTime = appGetHomeMap.formatTime;
              	$scope.formatDistance = appGetHomeMap.formatDistance;

              	$scope.initializeMap = function() {
	              	var mapInstance = appGetHomeMap.createMap($('#app-getHome-detail-map')[0]);
	              	var mapRoute = new nokia.maps.routing.component.RouteResultSet(route.originalRoute, {pen: {
							lineWidth: 3,
							lineJoin: 'round'
						}}).container;
					mapInstance.objects.add(mapRoute);
					$interval(function() {
						mapInstance.zoomTo(mapRoute.getBoundingBox(), false, "default");
					}, 200, 1);
              	};
              },
              size: 'lg'
            });
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
