angular.module('bridge.app').controller('bridge.app.detailController', ['$scope', '$routeParams', 'bridgeDataService','routeInfo', 'appInfo', function ($scope, $routeParams, bridgeDataService, routeInfo, appInfo) {
	$scope.detailScreen = {};
    $scope.detailScreen.htmlPage = routeInfo.templateUrl;
    $scope.detailScreen.route = routeInfo.route;
    $scope.detailScreen.icon_css = appInfo.icon_css;
    try {
    	$scope.detailScreen.title = bridgeDataService.getAppById($routeParams.appId).metadata.title;
	} catch(e) {
		$scope.detailScreen.title = appInfo.title;
	}
}]);
