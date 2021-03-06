﻿/*global nokia, window*/
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
		$scope.routes = appGetHomeConfig.getConfigForAppId($scope.metadata.guid).routes;

		if(!window.nokia) {
			$scope.nokiaLibrariesNotLoaded = true;
		}

		$scope.openRouteDetails = function(route) {
            $modal.open({
              templateUrl: 'app/getHome/detail.html',
              controller: ["$scope", function($modalScope) {
				  $modalScope.route = route;
				  $modalScope.formatTime = mapsUtils.formatTime;
				  $modalScope.formatDistance = mapsUtils.formatDistance;

				  $modalScope.initializeMap = function() {
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
              }],
              windowClass: 'appGetHomeMapClass',
              size: 'lg'
            });
        };

        $scope.isActive = function(route) {
        	return route.isActive;
        };

        function routeDelayIsLowerThan15Percent(summary) {
        	return (summary.trafficTime  * 100 / summary.baseTime) / 100 <= 1.15;
        }

        function routeDelayIsBetween15And30Percent(summary) {
        	return (summary.trafficTime  * 100 / summary.baseTime) / 100 > 1.15 && (summary.trafficTime  * 100 / summary.baseTime) / 100 <= 1.30;
        }

        function routeDelayIsHigherThan30Percent(summary) {
        	return (summary.trafficTime  * 100 / summary.baseTime) / 100 > 1.30;
        }

		$scope.getRouteColorClass = function(summary){
			if (routeDelayIsLowerThan15Percent(summary)){
				return 'green-80';
			} else if (routeDelayIsBetween15And30Percent(summary)){
				return 'yellow-80';
			} else if (routeDelayIsHigherThan30Percent(summary)){
				return 'red-80';
			}
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/getHome/overview.html',
		controller: directiveController,
		link: function($scope) {

			if ($scope.appConfig !== undefined && !angular.equals({}, $scope.appConfig) && appGetHomeConfig.getConfigForAppId($scope.metadata.guid).routes.length === 0) {
				$scope.appConfig.map(function(configItem) {
					appGetHomeConfig.getConfigForAppId($scope.metadata.guid).addRouteFromConfig(configItem);
				});
			}
		}
	};
}]);
