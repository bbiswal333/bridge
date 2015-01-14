/*global nokia*/
angular.module('app.getHome', ["bridge.service"]);
angular.module('app.getHome').directive('app.getHome', [ 'app.getHome.configservice', 'bridge.service.maps.utils', 'bridge.service.maps.mapService', '$modal', '$interval', function (appGetHomeConfig, mapsUtils, mapService, $modal, $interval) {

	var directiveController = ['$scope', function ($scope)
	{
		$scope.box.boxSize = "2";
		$scope.box.settingScreenData = {
			templatePath: "getHome/settings.html",
			controller: angular.module('app.getHome').appGetHomeSettings
		};
		$scope.formatTime = mapsUtils.formatTime;
		$scope.formatDistance = mapsUtils.formatDistance;
		$scope.routes = appGetHomeConfig.routes;

		$scope.box.returnConfig = function () {
			return appGetHomeConfig.routes.map(function(route) {
				return {
					routeId: route.routeId,
					waypoints: route.calculatedWaypoints,
					name: route.name,
					isActive: route.isActive
				};
			});
		};

		$scope.openRouteDetails = function(route) {
            $modal.open({
              templateUrl: 'app/getHome/detail.html',
              controller: function($scope) {
              	$scope.route = route;
              	$scope.formatTime = mapsUtils.formatTime;
              	$scope.formatDistance = mapsUtils.formatDistance;

              	$scope.initializeMap = function() {
	              	var mapInstance = mapService.createMap($('#app-getHome-detail-map')[0]);
	              	var routeLayer = new nokia.maps.map.Container();
	              	var markerLayer = new nokia.maps.map.Container();
					mapInstance.objects.add(routeLayer);
					mapInstance.objects.add(markerLayer);
					var startMarker = new nokia.maps.map.StandardMarker(route.waypoints[0].position, {
						draggable: false,
						visibility: true,
						text: "A"
					});
					var endMarker = new nokia.maps.map.StandardMarker(route.waypoints[route.waypoints.length - 1].position, {
						draggable: false,
						visibility: true,
						text: "B"
					});
					markerLayer.objects.add(startMarker);
					markerLayer.objects.add(endMarker);
					routeLayer.objects.add(mapService.createRoutePolyline(route, {lineWidth: 4}));
					$interval(function() {
						mapInstance.zoomTo(routeLayer.getBoundingBox());
					}, 200, 1);
              	};
              },
              windowClass: 'appGetHomeMapClass',
              size: 'lg'
            });
        };

        $scope.isActive = function(route) {
        	return route.isActive;
        };
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/getHome/overview.html',
		controller: directiveController,
		link: function($scope) {

			if ($scope.appConfig !== undefined && !angular.equals({}, $scope.appConfig) && appGetHomeConfig.routes.length === 0) {
				$scope.appConfig.map(function(configItem) {
					appGetHomeConfig.addRouteFromConfig(configItem);
				});
			}
		}
	};
}]);
