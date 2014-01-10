var bridgeApp = angular.module('bridgeApp', ['bridgeServices', 'ngAnimate', 'ngRoute', 'googlechart', 'ui.bootstrap', 'ngTable']);


bridgeApp.controller('bridgeController', ['$scope', '$http', '$route', '$location', function Controller($scope, $http, $route, $location) {
    /*if($location.path() === ''){
		$location.path('/overview');
    }*/
}]);

bridgeApp.controller('bridgeControllerOverview', ['$scope', '$http', '$route', '$routeParams', function Controller($scope, $http, $route, $routeParams) {
    this.$routeParams = $routeParams;
    $scope.$parent.titleExtension = "";
}]);

bridgeApp.controller('bridgeControllerDetail', ['$scope', '$http', '$route', '$routeParams', function Controller($scope, $http, $route, $routeParams) {
	//todo: pass parameters to detail screen
	//todo: stay on page at refresh
}]);


bridgeApp.config(function($routeProvider, $locationProvider) {
	$routeProvider.when("/", { templateUrl: 'view/overview.html', controller: 'bridgeControllerOverview' });
    $routeProvider.when("/detail/atc/", { templateUrl: 'app/atcBox/AtcBoxDetails.html', controller: 'atcDetailController' });
    $routeProvider.when("/detail/jira/", { templateUrl: 'app/jiraBox/JiraBoxDetails.html', controller: 'jiraDetailController' });
});


var bridgeServices = angular.module('bridgeServices', ['ngResource']);

bridgeApp.filter("decodeIcon",function(){
    return function (str) {
        if (str == undefined)
            return "";
        var el = document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    }
})