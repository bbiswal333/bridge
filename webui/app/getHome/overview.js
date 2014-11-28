/*global nokia*/
angular.module('app.getHome', ["bridge.service"]);
angular.module('app.getHome').directive('app.getHome', [ 'app.getHome.configservice', 'bridge.service.maps', '$modal', '$interval', function (appGetHomeConfig, appGetHomeMap, $modal, $interval) {

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
	              	var routeLayer = new nokia.maps.map.Container();
	              	var markerLayer = new nokia.maps.map.Container();
					mapInstance.objects.add(routeLayer);
					mapInstance.objects.add(markerLayer);
					var startMarker = new nokia.maps.map.StandardMarker(route.originalRoute.waypoints[0].mappedPosition, {
						draggable: false,
						visibility: true,
						text: "A"
					});
					var endMarker = new nokia.maps.map.StandardMarker(route.originalRoute.waypoints[route.originalRoute.waypoints.length - 1].mappedPosition, {
						draggable: false,
						visibility: true,
						text: "B"
					});
					markerLayer.objects.add(startMarker);
					markerLayer.objects.add(endMarker);
					routeLayer.objects.add(appGetHomeMap.createRoutePolyline(route.originalRoute, {lineWidth: 4}));
					$interval(function() {
						mapInstance.zoomTo(routeLayer.getBoundingBox());
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
