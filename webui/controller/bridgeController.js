var bridgeApp = angular.module('bridgeApp', ['ngAnimate', 'ngRoute', 'googlechart', 'ui.bootstrap', 'ngTable',
    // Own modules
    'bridgeServices',
    'employeeSearch',
    // Apps
    'testBoxApp',
    'atcApp',
    'jiraApp',
    'employeeBoxApp']);


bridgeApp.controller('bridgeController', ['$scope', '$http', '$route', '$location', 'bridgeDataService', function Controller($scope, $http, $route, $location, bridgeDataService) {
    if ($location.path() == "" || $location.path() == "/")
        $scope.showLoadingAnimation = true;

    $scope.settings_click = function () {
        $location.path('/settings');
    };

    var initializationInterval = setInterval(function () {
        var numberOfBoxInstances = 0;
        var numberOfBoxInstancesWhichDontNeedToBeInstantiated = 0;
        for (var box in bridgeDataService.boxInstances) {
            numberOfBoxInstances++;
            if (bridgeDataService.boxInstances[box].initializationTries > 50 || bridgeDataService.boxInstances[box].initialized == true) {
                numberOfBoxInstancesWhichDontNeedToBeInstantiated++;
                continue;
            }
            if (bridgeDataService.boxInstances[box].scope.loadData && bridgeDataService.boxInstances[box].dataLoadCalled != true) {
                bridgeDataService.boxInstances[box].scope.loadData();
                bridgeDataService.boxInstances[box].dataLoadCalled = true;
            } else {
                bridgeDataService.boxInstances[box].initializationTries++;
            }
        }

        if (numberOfBoxInstances == numberOfBoxInstancesWhichDontNeedToBeInstantiated && numberOfBoxInstances != 0) {
            clearInterval(initializationInterval);
            createRefreshInterval();
            $scope.showLoadingAnimation = false;
        }
    }, 100);

    var createRefreshInterval = function() {
        setInterval(function () {
            for (var box in bridgeDataService.boxInstances) {
                if (bridgeDataService.boxInstances[box].scope && bridgeDataService.boxInstances[box].scope.loadData) {
                    bridgeDataService.boxInstances[box].scope.loadData();
                }
            }
        }, 30000);
    }
}]);

bridgeApp.controller('bridgeControllerOverview', ['$scope', '$http', '$route', '$routeParams', function Controller($scope, $http, $route, $routeParams) {
    this.$routeParams = $routeParams;
    $scope.$parent.titleExtension = "";
}]);


bridgeApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html',
        controller: 'bridgeControllerOverview',
    });
    $routeProvider.when("/detail/atc/", { templateUrl: 'app/atcBox/AtcBoxDetails.html', controller: 'atcDetailController' });
    $routeProvider.when("/detail/jira/", { templateUrl: 'app/jiraBox/JiraBoxDetails.html', controller: 'jiraDetailController' });
    $routeProvider.when("/settings", { templateUrl: 'view/settings.html', controller: 'bridgeSettingsController' });
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