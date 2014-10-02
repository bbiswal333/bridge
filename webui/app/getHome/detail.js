angular.module('app.getHome').controller('app.getHome.detailCtrl', ['$scope', 'app.getHome.mapservice', '$location', function ($scope, appGetHomeMap, $location) {

	var mapContainer = document.getElementById("app-getHome-detail-map");

	if (!appGetHomeMap.routesCalculated()) {
		$location.path("/");
	}

	appGetHomeMap.displayMap(mapContainer);

	$scope.time_with_traffic = appGetHomeMap.formatTime(appGetHomeMap.getTimeWithTraffic());
	$scope.overtime_with_traffic = appGetHomeMap.formatTime(appGetHomeMap.getOverTimeWithTraffic());
	$scope.time_without_traffic = appGetHomeMap.formatTime(appGetHomeMap.getTimeWithoutTraffic());

}]);
