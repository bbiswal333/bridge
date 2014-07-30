angular.module('bridge.app').controller('bridgeController',
    ['$scope', '$http', '$window', '$route', '$location', '$timeout', '$q', '$log', 'bridgeDataService', 'bridgeConfig', 'sortableConfig', "notifier", "$modal", 'bridgeInBrowserNotification', "bridge.service.bridgeDownload",
    function ($scope, $http, $window, $route, $location, $timeout, $q, $log, bridgeDataService, bridgeConfig, sortableConfig, notifier, $modal, bridgeInBrowserNotification, bridgeDownloadService) {

        $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
            if( newValue !== oldValue)
            {
                var paq = paq || [];
                paq.push(['trackPageView', newValue]);
            }
        });

        $scope.getSidePane = function () {
            return $scope.sidePanel;
        };

        $scope.bridge_notifications_click = function () {
            $scope.sidePanel = 'view/bridgeNotifications.html';
            if ($scope.sideView === "notifications" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "notifications";
        };

        $scope.bridge_settings_click = function () {
            $scope.sidePanel = 'view/bridgeSettings.html';
            if ($scope.sideView === "settings" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
                if ($scope.show_settings === false) {
                    bridgeConfig.persistInBackend(bridgeDataService);
                }
            }
            $scope.sideView = "settings";
        };

        $scope.bridge_hide_settings = function () {
            if ($scope.show_settings === true) {
                $scope.show_settings = false;
                bridgeConfig.persistInBackend(bridgeDataService);
            }
        };

        $scope.bridge_feedback_click = function () {
            $scope.sidePanel = 'view/bridgeFeedback.html';
            if ($scope.sideView === "feedback" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "feedback";
        };

        $scope.bridge_github_click = function () {
            $scope.sidePanel = 'view/bridgeGithub.html';
            if ($scope.sideView === "github" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "github";
        };

        $scope.show_download = bridgeDownloadService.show_download;

        $http.get(window.client.origin + '/client').success(function () {
            $scope.client = true;
        }).error(function () {
            $scope.client = false;
        });

        if ($location.path() === "" || $location.path() === "/") {
            $scope.showLoadingAnimation = true;
        }

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
                        if($scope.apps[j].module_name === $scope.visible_apps[i].module_name)
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
                        return appInstance.scope.box.settingScreenData.templatePath;
                    },
                    templateController: function () {
                        return appInstance.scope.box.settingScreenData.controller;
                    },
                    boxController: function () {
                        return appInstance;
                    },
                    boxScope: function () {
                        return appInstance.scope;
                    }
                }
            });

            //$scope.location = $location;
            /*$scope.$watch(function() {
                return $location.path();
            }, function (newVal, oldVal) {
                if (oldVal !== newVal) {
                    $scope.modalInstance.close();
                }
            });*/

            // save the config in the backend no matter if the result was ok or cancel -> we have no cancel button at the moment, but clicking on the faded screen = cancel
            function onModalClosed() {
                bridgeConfig.persistInBackend(bridgeDataService);
                $scope.modalInstance = null;
            }
            this.modalInstance.result.then(onModalClosed, onModalClosed);
        };

        $scope.apps = [];
        $scope.$watch('apps', function () {
            if (!$scope.visible_apps) {
                $scope.visible_apps = [];
            }
            if ($scope.apps)
            {
                for (var i = 0; i < $scope.apps.length; i++)
                {
                    var module_visible = false;
                    if ($scope.apps[i].show)
                    {
                        for(var j = 0; j < $scope.visible_apps.length; j++)
                        {
                            if( $scope.apps[i].module_name === $scope.visible_apps[j].module_name ){
                                module_visible = true;
                            }
                        }
                       if(!module_visible)
                        {
                            var push_app = $scope.apps[i];
                            if (push_app.order === undefined) {
                                push_app.order = $scope.visible_apps.length;
                            }
                            $scope.visible_apps.push(push_app);
                        }
                    }
                    else
                    {
                        var module_index = 0;
                        for(var k = 0; k < $scope.visible_apps.length; k++)
                        {
                            if( $scope.apps[i].module_name === $scope.visible_apps[k].module_name )
                            {
                                module_visible = true;
                                module_index = k;
                            }
                        }
                       if(module_visible)
                        {
                            $scope.visible_apps.splice(module_index, 1);
                        }
                    }
                }


                $scope.visible_apps.sort(function (app1, app2){
                    if (app1.order < app2.order) {
                        return -1;
                    }
                    if (app1.order > app2.order) {
                        return 1;
                    }
                    return 0;
                });

            }
        }, true);

        $scope.$on('closeSettingsScreenRequested', function () {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
        });

        $scope.$on('bridgeConfigLoadedReceived', function (event) {
            bridgeInBrowserNotification.setScope($scope);
            $scope.sortableOptions = sortableConfig.sortableOptions;
            $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
            $scope.temporaryData = bridgeDataService.getTemporaryData();
            $scope.apps = bridgeDataService.getAppMetadataForProject(0);
            $scope.configLoadingFinished = true;
            $scope.showLoadingAnimation = false;
        });
    }
]);

angular.module('bridge.app').config(["$routeProvider", "$compileProvider", "$locationProvider", "$httpProvider", "lib.utils.calUtilsProvider","bridge.service.loaderProvider", function ($routeProvider, $compileProvider, $locationProvider, $httpProvider, calUtils, bridgeLoaderServiceProvider) {
    //main overview page
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html'
    });

    //detail controller registered by module files
    function routeInfo($q, $route) {
        var defer = $q.defer();
        var info = $route.current.info;
        defer.resolve(info);
        return defer.promise;
    }
    function appInfo($q, $route) {
        var defer = $q.defer();
        var info = $route.current.app;
        defer.resolve(info);
        return defer.promise;
    }

    for(var i = 0; i < bridgeLoaderServiceProvider.apps.length; i ++)
    {
        var app = bridgeLoaderServiceProvider.apps[i];
        if(app.routes !== undefined && Object.prototype.toString.call( app.routes ) === '[object Array]')
        {
            for(var j = 0; j < app.routes.length; j++)
            {
                $routeProvider.when(app.routes[j].route,
                    {
                        templateUrl: 'view/detail.html',
                        controller: 'bridge.app.detailController',
                        info: app.routes[j],
                        app: bridgeLoaderServiceProvider.apps[i],
                        resolve: {
                            routeInfo: routeInfo,
                            appInfo: appInfo
                        }
                    });
            }
        }
    }

    //If no valid URL has been entered redirect to main entry point
    $routeProvider.otherwise({
        redirectTo: "/"
    });

    // needed for all requests to abap backends where we use SSO - for all other calls set withCredentials to false
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('bridge.app.httpInterceptor');

    //allow blob, tel, mailto links
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|tel|mailto):/);
}]);

angular.module('bridge.app').run(function ($rootScope, $q, $templateCache, $location, bridgeDataService, bridgeInBrowserNotification) {
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
    $rootScope.$on("$locationChangeStart", function(event, args) {
        $rootScope.$broadcast('closeSettingsScreenRequested', args);
    });

    if ($location.search().clientMode === "true") {
        bridgeDataService.setClientMode(true);
    }

    var deferred = $q.defer();
    bridgeDataService.initialize(deferred).then(function () {
        $rootScope.$emit('bridgeConfigLoaded', {});
    }, function () { // promise rejected = config load failed
        bridgeInBrowserNotification.setScope($rootScope);
        bridgeInBrowserNotification.addAlert("danger", "Bridge could not load your configuration. Most of the times, this is the case when you use Firefox and have not configured it correctly. Please see in our <a href='https://github.wdf.sap.corp/bridge/bridge/wiki/Browser-Support'>Wiki</a> how to do that.", 600);
    });
});


angular.module('bridge.app').filter("decodeIcon", function () {
    return function (str) {
        if (str === undefined) {
            return "";
        }
        var el = document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    };
});


angular.module('bridge.app').factory('bridge.app.httpInterceptor', ['$q', '$rootScope', '$injector', '$location', '$timeout', function ($q, $rootScope, $injector, $location, $timeout) {

    var $http;
    var bridgeDataService;
    var rProtocol = /^http|^https/i;
    var rLocalhost = /^https:\/\/localhost/i;

    function checkResponse (response) {
        $timeout.cancel(response.config.timer);

        // inject $http object manually, see: http://stackoverflow.com/questions/20647483/angularjs-injecting-service-into-a-http-interceptor-circular-dependency
        // for the same reason we need to inject the bridgeDataService manually (as it needs the $https service)
        $http = $http || $injector.get('$http');
        if ($http.pendingRequests.length < 1)
        {
            $rootScope.showLoadingBar = false;
            response.config.timer = undefined;
        }
    }

    function rerouteCall(oConfig) {
        var sNewUrl = "";
        var sEncodedUrl = "";

        if (oConfig.method === "GET") {
            //oConfig.url = oConfig.url.replace(/\?/, "&");
            sEncodedUrl = encodeURIComponent(oConfig.url);
            sNewUrl = "https://localhost:1972/api/get?url=" + sEncodedUrl;
        } else {
            sNewUrl = oConfig.url;
        }

        return sNewUrl;
    }

    function uncachifyUrl(url) {
        var resultUrl = url + "?" + new Date().getTime();
        if(url.indexOf("?") >= 0)
        {
            resultUrl = url + "&" + new Date().getTime();
        }
        return resultUrl;
    }

    return {
        'request': function(config)
        {
            bridgeDataService = bridgeDataService || $injector.get('bridgeDataService');
            // if we have an external call (starting with http/https) and we are in client mode, then route all calls via the client
            if (bridgeDataService.getClientMode() === true && rProtocol.test(config.url)) {
                // if the call already targets to localhost, don't modify it
                if (!rLocalhost.test(config.url)) {
                    var sNewUrl = rerouteCall(config);
                    config.url = sNewUrl;
                }
            }

            //IE wants to cache everything so all external https calls are uncached here
            if(config.url.indexOf("https://") !== -1)
            {
                config.url = uncachifyUrl(config.url);
            }

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
