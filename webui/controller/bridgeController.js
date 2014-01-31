var bridgeApp = angular.module('bridgeApp', ['ngAnimate', 'ngRoute', 'googlechart', 'ui.bootstrap', 'ngTable',
    // Own modules
    'employeeSearch',
    // Apps
    'testBoxApp',
    'atcApp',
    'jiraApp',
    'employeeBoxApp']);

bridgeApp.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});

bridgeApp.controller('bridgeController', ['$scope', '$http', '$route', '$location', '$timeout', '$q', 'bridgeDataService', 'bridgeConfig',
    function Controller($scope, $http, $route, $location, $timeout, $q, bridgeDataService, bridgeConfig) {

        if ($location.path() == "" || $location.path() == "/")
            $scope.showLoadingAnimation = true;

        $scope.settings_click = function () {
            $location.path('/settings');
        };

        $scope.overview_click = function () {
            $location.path('/');
            document.getElementById('overview-button').classList.add('selected');
            document.getElementById('projects-button').classList.remove('selected');
        };

        $scope.projects_click = function () {
            $location.path('/projects');
            document.getElementById('overview-button').classList.remove('selected');
            document.getElementById('projects-button').classList.add('selected');
        };

        $scope.$on('bridgeConfigLoadedReceived', function (event, args) {
            $scope.configLoadingFinished = true;
            $scope.showLoadingAnimation = false;
        });
}]);


bridgeApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html',
    });
    $routeProvider.when("/projects", { templateUrl: 'view/projects.html' });

    $routeProvider.when("/detail/atc/", { templateUrl: 'app/atcBox/AtcBoxDetails.html', controller: 'atcDetailController' });
    $routeProvider.when("/detail/jira/", { templateUrl: 'app/jiraBox/JiraBoxDetails.html', controller: 'jiraDetailController' });
    $routeProvider.when("/settings", { templateUrl: 'view/settings.html', controller: 'bridgeSettingsController' });
});

bridgeApp.run(function ($rootScope, $q, bridgeConfig) {

    var loadingRequests = 0;

    //Receive emitted message and broadcast it.
    //Event names must be distinct or browser will blow up!
    $rootScope.$on('bridgeConfigLoaded', function (event, args) {
        $rootScope.$broadcast('bridgeConfigLoadedReceived', args);
    });
    $rootScope.$on('changeLoadingStatusRequested', function (event, args) {
        var oldLoadingRequests = loadingRequests;

        args.showLoadingBar ? loadingRequests++ : loadingRequests--;
        if (loadingRequests > 0 && oldLoadingRequests == 0)
            $rootScope.showLoadingBar = true;
        else if (loadingRequests == 0 && oldLoadingRequests > 0)
            $rootScope.showLoadingBar = false;
    });

    var deferred = $q.defer();
    var promise = bridgeConfig.loadFromBackend(deferred);

    promise.then(function (config) {
        // if the config is not an object, then the user has no configuration stored in the backend
        if (angular.isObject(config))
            bridgeConfig.config = config;
        $rootScope.$emit('bridgeConfigLoaded', {});
    }, function () { // promise rejected = config load failed
        alert("Bridge could not load your configuration from system IFP. Make sure that you are connected to the network and refresh the page.");
    });
});


bridgeApp.filter("decodeIcon", function () {
    return function (str) {
        if (str == undefined)
            return "";
        var el = document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    }
});