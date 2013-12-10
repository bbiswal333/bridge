var bridgeApp = angular.module('bridgeApp', ['bridgeServices', 'ngRoute', 'googlechart', 'ui.bootstrap']);


bridgeApp.controller('bridgeController', ['$scope', '$http', '$route', '$location', function Controller($scope, $http, $route, $location) {
	$location.path('/overview');
}]);

bridgeApp.controller('bridgeControllerOverview', ['$scope', '$http', '$route', function Controller($scope, $http, $route) {
	$scope.overview = true;
}]);

bridgeApp.controller('bridgeControllerDetail', ['$scope', '$http', '$route', function Controller($scope, $http, $route) {
	$scope.back = function() {
		$location.path('/overview');
	};
}]);


bridgeApp.config(function($routeProvider) {

	$routeProvider.when("/overview", {templateUrl:'view/overview.html', controller:'bridgeControllerOverview'});
	$routeProvider.when("/detail", {templateUrl:'view/detail.html', controller:'bridgeControllerDetail'});

});


var bridgeServices = angular.module('bridgeServices', ['ngResource']);