var bridgeApp = angular.module('bridgeApp', ['bridgeServices', 'ngAnimate', 'ngRoute', 'googlechart', 'ui.bootstrap', 'ngTable']);


bridgeApp.controller('bridgeController', ['$scope', '$http', '$route', '$location', 'bridgeDataService', function Controller($scope, $http, $route, $location, bridgeDataService) {
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
            hideLoadingAnimation();
        }
    }, 100);

    var hideLoadingAnimation = function() {
        window.setTimeout(function () { document.getElementById("spinner").parentNode.removeChild(document.getElementById("spinner")); }, 50);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.opacity = 0.9; }, 50);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.bottom = "10%"; }, 50);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.opacity = 0.7; }, 100);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.bottom = "30%"; }, 100);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.opacity = 0.5; }, 150);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.bottom = "50%"; }, 150);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.opacity = 0.3; }, 200);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.bottom = "70%"; }, 200);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.opacity = 0.1; }, 250);
        window.setTimeout(function () { document.getElementById("loadingAnimation").style.bottom = "90%"; }, 250);
        window.setTimeout(function () { document.getElementById("loadingAnimation").parentNode.removeChild(document.getElementById("loadingAnimation")); }, 350);
    }

    var createRefreshInterval = function() {
        setInterval(function () {
            for (var box in bridgeDataService.boxInstances) {
                if (bridgeDataService.boxInstances[box].scope && bridgeDataService.boxInstances[box].scope.loadData) {
                    bridgeDataService.boxInstances[box].scope.loadData();
                }
            }
        }, 5000);
    }
}]);

bridgeApp.controller('bridgeControllerOverview', ['$scope', '$http', '$route', '$routeParams', function Controller($scope, $http, $route, $routeParams) {
    this.$routeParams = $routeParams;
    $scope.$parent.titleExtension = "";
}]);


bridgeApp.config(function($routeProvider, $locationProvider) {
	$routeProvider.when("/", { templateUrl: 'view/overview.html', controller: 'bridgeControllerOverview' });
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