angular.module('app.getHome').controller('app.getHome.detailCtrl', ['$scope', 'app.getHome.mapservice', function ($scope, appGetHomeMap) {

	var mapContainer = document.getElementById("app-getHome-detail-map");

	appGetHomeMap.displayMap(mapContainer);

}]);
