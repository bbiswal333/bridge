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
    ['$scope', '$http', '$window', '$route', '$location', '$timeout', '$q', '$log', 'bridgeDataService', 'bridgeConfig', 'sortableConfig', "notifier", "$modal", 'bridgeCounter', 'bridgeInBrowserNotification', "bridge.service.bridgeDownload", 
    function ($scope, $http, $window, $route, $location, $timeout, $q, $log, bridgeDataService, bridgeConfig, sortableConfig, notifier, $modal, bridgeCounter, bridgeInBrowserNotification, bridgeDownloadService) {            

        $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){  
            if( newValue !== oldValue)
            {
                var _paq = _paq || [];
                _paq.push(['trackPageView', newValue]);
            }
        });

        $scope.getSidePane = function(){
            return $scope.sidePanel;
        }
        
         $scope.bridge_settings_click =  function(){
            $scope.sidePanel = 'view/bridgeSettings.html';
            if($scope.sideView == "settings" || !$scope.show_settings)
            {
                $scope.show_settings = !$scope.show_settings;
                if ($scope.show_settings == false) {    
                    bridgeConfig.persistInBackend(bridgeDataService);                    
                }
            }
            $scope.sideView = "settings";                   
        }

        $scope.bridge_hide_settings = function () {
            if ($scope.show_settings == true) {
                $scope.show_settings = false;
                bridgeConfig.persistInBackend(bridgeDataService);
            }
        }

        $scope.bridge_feedback_click =  function(){
            $scope.sidePanel = 'view/bridgeFeedback.html';
            if($scope.sideView == "feedback" || !$scope.show_settings)
            {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "feedback";            
        }

        $scope.bridge_github_click = function () {
            $scope.sidePanel = 'view/bridgeGithub.html';
            if($scope.sideView == "github" || !$scope.show_settings)
            {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "github";                
        }    

        $scope.show_download = bridgeDownloadService.show_download;                    

        $http.get(window.client.origin + '/client').success(function (data, status) {
            $scope.client = true;
        }).error(function (data, status, header, config) { 
            $scope.client = false;     
        });

        if ($location.path() == "" || $location.path() == "/")
            $scope.showLoadingAnimation = true;
                                           
        window.debug = {
            resetConfig: function()
                        {
                bridgeDataService.toDefault();
                bridgeConfig.persistInBackend(bridgeDataService);
                        }
        };


        $scope.toggleDragging = function(){
            if( !$scope.sortableOptions.disabled )
            {              

              for (var i = 0; i < $scope.visible_apps.length; i++) {
                    for(var j = 0; j < $scope.apps.length; j++)
                    {
                        if($scope.apps[j].module_name == $scope.visible_apps[i].module_name)
                        {
                            $scope.apps[j].order = i;
                        }
                    }
              }
              bridgeConfig.persistInBackend(bridgeDataService);                          
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

        $scope.showSettingsModal = function (appId) {
            var appInstance = bridgeDataService.getAppById(appId);

            $scope.modalInstance = $modal.open({
                templateUrl: 'view/settings.html',
                windowClass: 'settings-dialog',
                controller: angular.module('bridge.app').settingsController,
                resolve: {
                    templateString: function () {
                        return appInstance.scope.settingScreenData.templatePath;
                    },
                    templateController: function () {
                        return appInstance.scope.settingScreenData.controller;
                    },
                    boxController: function () {
                        return appInstance;
                    },
                    boxScope: function () {
                        return appInstance.scope;
                    },
                }
            });

            var that = this;

            // save the config in the backend no matter if the result was ok or cancel -> we have no cancel button at the moment, but clicking on the faded screen = cancel
            this.modalInstance.result.then(function (selectedItem) {
                bridgeConfig.persistInBackend(bridgeDataService);
            }, function () {
                bridgeConfig.persistInBackend(bridgeDataService);
            });
        };

        $scope.apps = [];
        $scope.$watch('apps', function () {
            if(!$scope.visible_apps) $scope.visible_apps = [];
            if ($scope.apps) 
            {            
                for (var i = 0; i < $scope.apps.length; i++) 
                {
                    if ($scope.apps[i].show)
                    {
                        var module_visible = false;
                        for(var j = 0; j < $scope.visible_apps.length; j++)
                        {                            
                            if( $scope.apps[i].module_name == $scope.visible_apps[j].module_name )
                            {
                                module_visible = true;
                            }                         
                        }    
                       if(!module_visible)
                        {
                            var push_app = $scope.apps[i];
                            if(push_app.order == undefined) push_app.order = $scope.visible_apps.length;
                            $scope.visible_apps.push(push_app);        
                        }                                    
                    }
                    else
                    {
                        var module_visible = false;
                        var module_index = 0;
                        for(var j = 0; j < $scope.visible_apps.length; j++)
                        {                            
                            if( $scope.apps[i].module_name == $scope.visible_apps[j].module_name )
                            {
                                module_visible = true;
                                module_index = j;                                
                            }                         
                        }    
                       if(module_visible)
                        {
                            $scope.visible_apps.splice(module_index, 1);
                        }       
                    }
                };   
                
                
                $scope.visible_apps.sort(function (app1, app2){
                    if( app1.order < app2.order ) return -1;
                    if( app1.order > app2.order ) return 1;
                    return 0;
                });
                                 
            }
        }, true);

        $scope.$on('closeSettingsScreenRequested', function () {
            $scope.modalInstance.close();
        });

        $scope.$on('bridgeConfigLoadedReceived', function (event, args) {
            bridgeInBrowserNotification.setScope($scope);
            $scope.sortableOptions = sortableConfig.sortableOptions;
            $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
            $scope.apps = bridgeDataService.getAppMetadataForProject(0);

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
    }
]);

angular.module('bridge.app').config(["$routeProvider", "$compileProvider", "$locationProvider", "$httpProvider", "lib.utils.calUtilsProvider", function ($routeProvider, $compileProvider, $locationProvider, $httpProvider, calUtils) {
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html',
    });
    $routeProvider.when("/projects", { templateUrl: 'view/projects.html' });

    $routeProvider.when("/detail/im/", { templateUrl: 'app/im/detail.html', controller: 'app.im.detailController' });
    $routeProvider.when("/detail/imtl/", { templateUrl: 'app/imtl/detail.html', controller: 'app.imtl.detailController' });
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
    $httpProvider.interceptors.push('bridge.app.httpInterceptor');

    //make blob safe
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|tel|mailto):/);  
}]);

angular.module('bridge.app').run(function ($rootScope, $q, $templateCache, bridgeDataService) {
    var loadingRequests = 0;

    //Receive emitted message and broadcast it.
    //Event names must be distinct or browser will blow up!
    $rootScope.$on('bridgeConfigLoaded', function (event, args) {
        $rootScope.$broadcast('bridgeConfigLoadedReceived', args);
    });   
    $rootScope.$on("refreshApp", function (event, args) {
        $rootScope.$broadcast('refreshAppReceived', args);
    });
    $rootScope.$on("closeSettingsScreen", function (event, args) {
        $rootScope.$broadcast('closeSettingsScreenRequested', args);
    });

    var deferred = $q.defer();
    bridgeDataService.initialize(deferred).then(function () {
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

 
