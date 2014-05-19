angular.module('bridge.app').controller('bridge.app.detailController', ['$scope', '$routeParams','routeInfo', 'appInfo', function ($scope, $routeParams, routeInfo, appInfo) {		
	$scope.detailScreen = {};
    $scope.detailScreen.htmlPage = routeInfo.templateUrl;
    $scope.detailScreen.route = routeInfo.route;
    $scope.detailScreen.title = appInfo.title;
    $scope.detailScreen.icon_css = appInfo.icon_css;    
}]);