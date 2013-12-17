var bridgeApp = angular.module('bridgeApp', ['bridgeServices', 'ngRoute', 'googlechart', 'ui.bootstrap', 'ngTable']);


bridgeApp.controller('bridgeController', ['$scope', '$http', '$route', '$location', function Controller($scope, $http, $route, $location) {
    $location.path('/overview');
}]);

bridgeApp.controller('bridgeControllerOverview', ['$scope', '$http', '$route', '$routeParams', function Controller($scope, $http, $route, $routeParams) {
    this.$routeParams = $routeParams;
    $scope.$parent.titleExtension = "";
}]);

bridgeApp.controller('bridgeControllerDetail', ['$scope', '$http', '$route', '$routeParams', function Controller($scope, $http, $route, $routeParams) {
	//todo: pass parameters to detail screen
	//todo: stay on page at refresh
}]);


bridgeApp.config(function($routeProvider) {

    $routeProvider.when("/overview", { templateUrl: 'view/overview.html', controller: 'bridgeControllerOverview' });
    $routeProvider.when("/detail/atc", { templateUrl: 'app/atcBox/AtcBoxDetails.html', controller: 'atcDetailController' });
	$routeProvider.when("/detail/:boxname", { templateUrl: 'view/detail.html', controller: 'bridgeControllerDetail', controllerAs: 'boxname' });
});


var bridgeServices = angular.module('bridgeServices', ['ngResource']);