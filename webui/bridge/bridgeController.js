angular.module('bridge.app', [
    //external stuff
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'dialogs',
    'googlechart',
    'ui.bootstrap',
    'mgcrea.ngStrap',
    'ngTable',
    'mb-scrollbar',
    // bridge modules
    'bridge.employeeSearch',
    'bridge.box',
    // bridge apps
    'app.test',
    'app.atc',
    'app.im',
    'app.jira',
    'app.employeeSearch', 
    'app.meetings',
    'app.cats',
    'app.lunchWalldorf',
    'app.githubMilestone',
    'ui.sortable',
    'app.cats.maintenanceView',
    'ui.select2']);

angular.module('bridge.app').directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});

angular.module('bridge.app').controller('bridgeController', ['$scope', '$http', '$route', '$location', '$timeout', '$q', '$log', 'bridgeDataService', 'bridgeConfig', 'sortableConfig',
    function ($scope, $http, $route, $location, $timeout, $q, $log, bridgeDataService, bridgeConfig, sortableConfig) {
        $http.get('http://localhost:8000/client').success(function (data, status) {            
        }).error(function (data, status, header, config) {            
            //alert('light mode detected');
        });

        if ($location.path() == "" || $location.path() == "/")
            $scope.showLoadingAnimation = true;
                                           
          window.debug = {

            resetSort: function(){
                $scope.apps = sortableConfig.getDefaultConfig();
                bridgeConfig.config.bridgeSettings.apps = $scope.apps ; 
                bridgeConfig.persistInBackend(bridgeDataService.boxInstances);
                        }
          };


          $scope.toggleDragging = function(){
            if( !$scope.sortableOptions.disabled )
            {
              bridgeConfig.config.bridgeSettings.apps = $scope.apps ; 
              bridgeConfig.persistInBackend(bridgeDataService.boxInstances);  
            }
            $scope.sortableOptions.disabled = ! $scope.sortableOptions.disabled;
          }


        $scope.settings_click = function (boxId) {
            bridgeConfig.showSettingsModal(boxId);
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
                $scope.sortableOptions = sortableConfig.sortableOptions;
                if (bridgeConfig.config.bridgeSettings.apps != undefined && bridgeConfig.config.bridgeSettings.apps.length > 0 )
                { 
                    $scope.apps = bridgeConfig.config.bridgeSettings.apps; 
                }
                else 
                {
                    $scope.apps = sortableConfig.getDefaultConfig();
                }
                    $scope.configLoadingFinished = true;
                    $scope.showLoadingAnimation = false;   
                });
        }]);


angular.module('bridge.app').config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html',
    });
    $routeProvider.when("/projects", { templateUrl: 'view/projects.html' });

    $routeProvider.when("/detail/im/", { templateUrl: 'app/im/detail.html', controller: 'app.im.detailController' });
    //$routeProvider.when("/settings", { templateUrl: 'view/settings.html', controller: 'bridgeSettingsController' });
    $routeProvider.when("/detail/atc/", { templateUrl: 'app/atc/detail.html', controller: 'app.atc.detailcontroller' });
    $routeProvider.when("/detail/jira/", { templateUrl: 'app/jira/detail.html', controller: 'app.jira.detailController' });

    $routeProvider.when("/detail/cats/", { templateUrl: 'app/cats/detail.html'});    

    $routeProvider.otherwise({
        redirectTo: "/"
    });

    // needed for all requests to abap backends where we use SSO - for all other calls set withCredentials to false
    $httpProvider.defaults.withCredentials = true;

});

angular.module('bridge.app').run(function ($rootScope, $q, $templateCache, bridgeConfig) {
    var loadingRequests = 0;

    //Receive emitted message and broadcast it.
    //Event names must be distinct or browser will blow up!
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


angular.module('bridge.app').filter("decodeIcon", function () {
    return function (str) {
        if (str == undefined)
            return "";
        var el = document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    }
});


angular.module('bridge.app').factory('bridge.app.httpInterceptor',['$q','$rootScope', '$injector', '$location',function($q, $rootScope, $injector, $location){
  
    var $http;
    var checkResponse = function(response) {
        $http = $http || $injector.get('$http');
        if ($http.pendingRequests.length < 1)
        {
            $rootScope.showLoadingBar = false;
        }
    };

    return {
        'request': function(config)
        {                   
            $rootScope.showLoadingBar = true;            
            return config || $q.when(config);
        },
        'response': function(response)
        {            
            checkResponse(response);                
            return response || $q.when(response);
        },
        'responseError': function (response) 
        {            
            checkResponse(response);
            return $q.reject(response);
        }
    };

}]);

angular.module('bridge.app').config(['$httpProvider',function($httpProvider) {
  $httpProvider.interceptors.push('bridge.app.httpInterceptor');
}]);
