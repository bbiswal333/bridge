angular.module('bridge.app', [
    //external stuff
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'googlechart',
    'ui.bootstrap',
    'mgcrea.ngStrap',
    'ngTable',
    'mb-scrollbar',
    'ui.sortable',
    // bridge modules
    'bridge.service',
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
    'app.wire',
    'app.lunchWalldorf',
    'app.githubMilestone',
    'app.linkList',
    'app.cats.maintenanceView',
    'lib.utils',
    'notifier',
    "app.cats.maintenanceView.projectList",
    "ngScrollbar"]);

angular.module('bridge.app').directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});


angular.module('bridge.app').controller('bridgeController',
    ['$scope', '$http', '$route', '$location', '$timeout', '$q', '$log', 'bridgeDataService', 'bridgeConfig', 'sortableConfig', "notifier", "$modal", 'bridgeCounter', "bridge.service.bridgeDownload",
    function ($scope, $http, $route, $location, $timeout, $q, $log, bridgeDataService, bridgeConfig, sortableConfig, notifier, $modal, bridgeCounter, bridgeDownloadService) {
        
        $scope.getSidePane = function(){
            return $scope.sidePanel;
        }

        $scope.bridge_settings_click = function(){
            $scope.sidePanel = 'view/bridgeSettings.html';
            if($scope.sideView == "settings" || !$scope.show_settings)
            {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "settings";                        
        }

        $scope.bridge_feedback_click =  function(){
            $scope.sidePanel = 'view/bridgeFeedback.html';
            if($scope.sideView == "feedback" || !$scope.show_settings)
            {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "feedback";            
        }


        $scope.show_download = bridgeDownloadService.show_download;                    

        $http.get('http://localhost:8000/client').success(function (data, status) {
            $scope.client = true;
        }).error(function (data, status, header, config) { 
            $scope.client = false;     
        });

        if ($location.path() == "" || $location.path() == "/")
            $scope.showLoadingAnimation = true;
                                           
        window.debug = {

            resetSort: function(){
                $scope.apps = sortableConfig.getDefaultConfig();
                bridgeConfig.config.bridgeSettings.apps = $scope.apps ; 
                bridgeConfig.persistInBackend(bridgeDataService.boxInstances);
                        },
            resetConfig: function()
                        {
                            bridgeConfig.config = {
                                    bridgeSettings: {
                                                    apps: []
                                                    },
                                    boxSettings: [],
                                                    };    
                            bridgeConfig.persistInBackend();
                        }
        };


        $scope.toggleDragging = function(){
            if( !$scope.sortableOptions.disabled )
            {
              bridgeConfig.config.bridgeSettings.apps = $scope.apps ; 
              bridgeConfig.persistInBackend(bridgeDataService.boxInstances);  
            }
            $scope.sortableOptions.disabled = ! $scope.sortableOptions.disabled;
        };

        $scope.settings_click = function (boxId) {
            bridgeConfig.showSettingsModal(boxId);
        };

        $scope.overview_click = function () {
            $location.path('/');
            document.getElementById('overview-button').classList.add('selected');
            //document.getElementById('projects-button').classList.remove('selected');
        };

        $scope.projects_click = function () {
            $location.path('/projects');
            document.getElementById('overview-button').classList.remove('selected');
            document.getElementById('projects-button').classList.add('selected');
        };
        $scope.$on('changeBoxSizeReceived', function(event,size,boxId){
            console.log(size,boxId);
            console.log($scope.apps);
            for (var i = $scope.apps.length - 1; i >= 0; i--) {
                if($scope.apps[i].id == boxId)
                {
                    $scope.apps[i].size = "box-"+size;
                    break;
                }                                                    
            };
        })

        $scope.$on('bridgeConfigLoadedReceived', function (event, args) {
                $scope.sortableOptions = sortableConfig.sortableOptions;
                if (bridgeConfig.config.bridgeSettings.apps != undefined && bridgeConfig.config.bridgeSettings.apps.length > 0 )
                { 
                    $scope.apps = bridgeConfig.config.bridgeSettings.apps; 
                }
                else 
                {
                    bridgeConfig.config.bridgeSettings.apps = sortableConfig.getDefaultConfig();
                    $scope.apps = bridgeConfig.config.bridgeSettings.apps; 
                }

                bridgeCounter.CollectWebStats('MAIN', 'PAGELOAD');
                var deferred1 = $q.defer();
                var promise1 = bridgeCounter.GetWebStats(deferred1, '1', 'BROWSER_NOT_SUPPORTED', 'PAGELOAD');
                var deferred2 = $q.defer();
                var promise2 = bridgeCounter.GetWebStats(deferred2, '7', 'MAIN', 'PAGELOAD');
                promise1.then(function (counterData) {
                    if (angular.isObject(counterData)){
                        console.log('Browser not supported page for <ALL_SERVERS> today: ' + counterData.DATA[0].HITS + ' hits by ' + counterData.DATA[0].UNIQUE_USERS + ' distinct users');
                    };
                    promise2.then(function (counterData) {
                        if (angular.isObject(counterData)){
                            for (var i = 0; i < 7; i++) {
                                console.log(counterData.DATA[i].DATE + ': ' + counterData.DATA[i].HITS + ' hits by ' + counterData.DATA[i].UNIQUE_USERS + ' distinct users');
                            };
                        };
                    });
                });
                $scope.configLoadingFinished = true;
                $scope.showLoadingAnimation = false;   
            });

        }]);
        



angular.module('bridge.app').config(["$routeProvider", "$locationProvider", "$httpProvider", "lib.utils.calUtilsProvider", function ($routeProvider, $locationProvider, $httpProvider, calUtils) {
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html',
    });
    $routeProvider.when("/projects", { templateUrl: 'view/projects.html' });

    $routeProvider.when("/detail/im/", { templateUrl: 'app/im/detail.html', controller: 'app.im.detailController' });
    //$routeProvider.when("/settings", { templateUrl: 'view/settings.html', controller: 'bridgeSettingsController' });
    $routeProvider.when("/detail/atc/", { templateUrl: 'app/atc/detail.html', controller: 'app.atc.detailcontroller' });
    $routeProvider.when("/detail/jira/", { templateUrl: 'app/jira/detail.html', controller: 'app.jira.detailController' });

    $routeProvider.when("/detail/cats/:day/", { templateUrl: 'app/cats/detail.html'});
    //If no date is given in URL insert today and redirect there
    $routeProvider.when("/detail/cats/", { redirectTo: '/detail/cats/' + calUtils.stringifyDate(calUtils.today())});

    $routeProvider.when("/cats", {redirectTo: "/detail/cats/"});

    $routeProvider.when("/42/", {template: "", controller: function () {
         window.location.replace("https://de.wikipedia.org/wiki/Sinn_des_Lebens");
    }});

    //If no valid URL has been entered redirect to main entry point
    $routeProvider.otherwise({
        redirectTo: "/"
    });

    // needed for all requests to abap backends where we use SSO - for all other calls set withCredentials to false
    $httpProvider.defaults.withCredentials = true;

}]);

angular.module('bridge.app').run(function ($rootScope, $q, $templateCache, bridgeConfig) {
    var loadingRequests = 0;

    //Receive emitted message and broadcast it.
    //Event names must be distinct or browser will blow up!
    $rootScope.$on('bridgeConfigLoaded', function (event, args) {
        $rootScope.$broadcast('bridgeConfigLoadedReceived', args);
    });   
    $rootScope.$on("changeBoxSize", function (event, size, boxId) {           
            $rootScope.$broadcast('changeBoxSizeReceived', size, boxId);
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


angular.module('bridge.app').factory('bridge.app.httpInterceptor',['$q','$rootScope', '$injector', '$location', '$timeout',function($q, $rootScope, $injector, $location, $timeout){
  
    var $http;      

    var checkResponse = function(response) {
        
        $timeout.cancel(response.config.timer);

        $http = $http || $injector.get('$http');
        if ($http.pendingRequests.length < 1)
        {
            $rootScope.showLoadingBar = false;
            timer = undefined;
        }         
    };

    return {
        'request': function(config)
        {                         
            config.timer = $timeout(function()
            {                 
                $rootScope.showLoadingBar = true;               
            }, 500, true); 
            
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
