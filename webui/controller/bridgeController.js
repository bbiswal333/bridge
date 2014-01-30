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

        var allAppsInitialized = function () {
            var allInitialized = true;
            for (var box in bridgeDataService.boxInstances) {
                if (bridgeDataService.boxInstances[box].initialized == undefined || bridgeDataService.boxInstances[box].initialized == false) {
                    allInitialized = false;
                    break;
                }
            }
            
            return allInitialized;
        };

        var hideAnimationAndStartRefreshTimer = function () {
            if ($scope.showLoadingAnimation == true) {
                $scope.showLoadingAnimation = false;

                var createRefreshInterval = function () {
                    setInterval(function () {
                        for (var box in bridgeDataService.boxInstances) {
                            if (bridgeDataService.boxInstances[box].scope && bridgeDataService.boxInstances[box].scope.loadData) {
                                bridgeDataService.boxInstances[box].scope.loadData();
                            }
                        }
                    }, 60000);
                };
            }
        }

        $scope.$on('appInitializedReceived', function (event, args) {
            for (var box in bridgeDataService.boxInstances) {
                if (bridgeDataService.boxInstances[box].scope.boxId == args.id) {
                    bridgeDataService.boxInstances[box].initialized = true;
                    break;
                }
            }

            if (allAppsInitialized())
                hideAnimationAndStartRefreshTimer();
        });

        $scope.$on('bridgeConfigLoadedReceived', function (event, args) {
            $scope.configLoadingFinished = true;

            // give angular some time to render all apps + call their controller (-> be in the next $digest cycle)
            $timeout(function () {
                bridgeConfig.applyConfigToApps(bridgeDataService.boxInstances, bridgeConfig.config);

                for (var box in bridgeDataService.boxInstances) {
                    if (angular.isFunction(bridgeDataService.boxInstances[box].scope.loadData)) {
                        bridgeDataService.boxInstances[box].scope.loadData();
                    }
                    else {
                        // if the app has no loadData function, it is automatically initialized
                        bridgeDataService.boxInstances[box].initialized = true;
                    }
                };

                if (allAppsInitialized())
                    hideAnimationAndStartRefreshTimer();

                // hide loading screen after x seconds no matter if all apps are initialized or not
                $timeout(function () {
                    hideAnimationAndStartRefreshTimer();
                }, 5000);
            }, 500); 
        });
}]);

//bridgeApp.controller('bridgeControllerOverview', ['$scope', '$http', '$route', '$routeParams', function Controller($scope, $http, $route, $routeParams) {
//    this.$routeParams = $routeParams;
//    $scope.$parent.titleExtension = "";
//}]);


bridgeApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html',
        //controller: 'bridgeControllerOverview',
    });
    $routeProvider.when("/projects", { templateUrl: 'view/projects.html' });

    $routeProvider.when("/detail/atc/", { templateUrl: 'app/atcBox/AtcBoxDetails.html', controller: 'atcDetailController' });
    $routeProvider.when("/detail/jira/", { templateUrl: 'app/jiraBox/JiraBoxDetails.html', controller: 'jiraDetailController' });
    $routeProvider.when("/settings", { templateUrl: 'view/settings.html', controller: 'bridgeSettingsController' });
});

bridgeApp.run(function ($rootScope, $q, bridgeConfig) {
    //Receive emitted message and broadcast it.
    //Event names must be distinct or browser will blow up!
    $rootScope.$on('appInitialized', function (event, args) {
        $rootScope.$broadcast('appInitializedReceived', args);
    });
    $rootScope.$on('bridgeConfigLoaded', function (event, args) {
        $rootScope.$broadcast('bridgeConfigLoadedReceived', args);
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


//var bridgeServices = angular.module('bridgeServices', ['ngResource']);

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