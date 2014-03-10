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
    'lib.utils']);

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
        
        function getOS()
        {
            var OSName="Unknown OS";
            if (navigator.appVersion.indexOf("Win")!=-1) return "Windows";
            if (navigator.appVersion.indexOf("Mac")!=-1) return "MacOS";
            if (navigator.appVersion.indexOf("X11")!=-1) return "UNIX";
            if (navigator.appVersion.indexOf("Linux")!=-1) return "Linux";
            return OSName;
        };
        


        $http.get('http://localhost:8000/client').success(function (data, status) {
            $scope.winpro = false;
            $scope.macpro = false;  
        }).error(function (data, status, header, config) { 
            if( getOS() == "Windows")
            {
                $scope.winpro = true;
            }
            else if( getOS() == "MacOS")
            {
                $scope.macpro = true;
            }                      
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
            var templateString;
            var templateController;
            var boxController;
            var boxScope;

            for (var boxProperty in bridgeDataService.boxInstances) {
                if (bridgeDataService.boxInstances[boxProperty].scope.boxId == boxId) {
                    templateString = bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.templatePath;
                    templateController = bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.controller;
                    boxController = bridgeDataService.boxInstances[boxProperty];
                    boxScope = bridgeDataService.boxInstances[boxProperty].scope;
                }
            }

            console.log($modal);
            window.modalInstance = $modal.open({
                templateUrl: 'view/settings.html',
                controller: angular.module('bridge.app').settingsController,
                resolve: {
                    templateString: function () {
                        return templateString;
                    },
                    templateController: function () {
                        return templateController;
                    },
                    boxController: function () {
                        return boxController;
                    },
                    boxScope: function () {
                        return boxScope;
                    },
                }
            });

            // save the config in the backend no matter if the result was ok or cancel -> we have no cancel button at the moment, but clicking on the faded screen = cancel
            modalInstance.result.then(function (selectedItem) {
                bridgeConfig.persistInBackend(bridgeDataService.boxInstances);
            }, function () {
                bridgeConfig.persistInBackend(bridgeDataService.boxInstances);
            });
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
        console.log("test");
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
