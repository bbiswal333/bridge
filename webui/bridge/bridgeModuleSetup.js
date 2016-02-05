/*global window*/
angular.module('bridge.app').config(["$provide", "$routeProvider", "$compileProvider", "$locationProvider", "$httpProvider", "lib.utils.calUtilsProvider", "bridge.service.loaderProvider",
    function ($provide, $routeProvider, $compileProvider, $locationProvider, $httpProvider, calUtils, bridgeLoaderServiceProvider) {

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

        for (var i = 0; i < bridgeLoaderServiceProvider.apps.length; i++) {
            var app = bridgeLoaderServiceProvider.apps[i];
            if (app.routes !== undefined && Object.prototype.toString.call(app.routes) === '[object Array]') {
                for (var j = 0; j < app.routes.length; j++) {
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

        $provide.decorator('$log', ["$delegate", "$injector", function ($delegate, $injector) {
            function docorateLogger(originalFn) {
                return function () {
                    // https://shifteleven.com/articles/2007/06/28/array-like-objects-in-javascript/
                    var args = Array.prototype.slice.call(arguments);
                    var logProvider = $injector.get("bridge.diagnosis.logService");
                    logProvider.log(args[0]);

                    originalFn.apply(null, args);
                };
            }

            // decorate all the common logging methods
            ['log', 'debug', 'info', 'warn', 'error'].forEach(function (logFunction) {
                $delegate[logFunction] = docorateLogger($delegate[logFunction]);
                $delegate[logFunction].logs = []; // needed for angularMocks, without this, unit test will fail
            });
            return $delegate;
        }]);

        //main overview page
        $routeProvider.when("/", {
            templateUrl: 'view/overview.html'
        });

        $routeProvider.when("/view/:owner/:id", {
            templateUrl: 'view/overview.html'
        });

        $routeProvider.when("/view/:id", {
            templateUrl: 'view/overview.html'
        });

        $routeProvider.when("/diagnosis", {
            templateUrl: 'bridge/diagnosis/corsTestPage.html',
            controller: 'bridge.diagnosis.corsTestPageController'
        });

        $routeProvider.when("/status", {
            templateUrl: 'bridge/diagnosis/status.html',
            controller: 'bridge.diagnosis.statusController'
        });

        $routeProvider.when("/tetris", {
            templateUrl: 'bridge/search/funtime.html',
            controller: 'bridge.search.tetris'
        });

        $routeProvider.when("/whatsNew", {
            templateUrl: 'bridge/menubar/news/newsDetail.html',
            controller: 'bridge.newsDetailController'
        });

        $routeProvider.when("/availableApps", {
            templateUrl: 'bridge/menubar/applications/bridgeApplications.html',
            controller: 'bridge.menubar.applicationsController'
        });

        //If no valid URL has been entered redirect to main entry point
        $routeProvider.otherwise({
            redirectTo: "/"
        });

        // needed for all requests to abap backends where we use SSO - for all other calls set withCredentials to false
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('bridge.app.httpInterceptor');

        $httpProvider.useApplyAsync(true);

        //allow blob, tel, mailto links
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|tel|mailto):/);

        if(!angular.isUndefined(window.nokia)) {
            nokia.Settings.set("app_id", "TSCNwGZFblBU5DnJLAH8");
            nokia.Settings.set("app_code", "OvJJVLXUQZGWHmYf1HZCFg");
            nokia.Settings.set("secure.baseUrl", "https://route{serviceMode}.nlp.nokia.com/routing/7.2/");
            nokia.Settings.set("secureConnection", "force");
        }
}]);

angular.module('bridge.app').run(["$rootScope", "$q", "$injector", "$templateCache", "$location", "bridgeDataService", "bridgeInBrowserNotification", "bridge.search", "bridge.mobileSearch", "bridge.service.loader",
    function($rootScope, $q, $injector, $templateCache, $location, bridgeDataService, bridgeInBrowserNotification, bridgeSearch, bridgeMobileSearch, bridgeLoader) {
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
        $rootScope.$on("$locationChangeStart", function (event, args) {
            bridgeInBrowserNotification.removeAllAlerts();
            $rootScope.$broadcast('closeSettingsScreenRequested', args);
        });

        if ($location.search().clientMode === "true") {
            bridgeDataService.setClientMode(true);
        }
        if ($location.search().logMode === "true") {
            bridgeDataService.setLogMode(true);
        }

        function instantiateSerachProviders(injector, aSearchProvider) {
            if(!aSearchProvider) {
                return;
            }

            aSearchProvider.map(function(searchProvider) {
                injector.invoke([searchProvider, function(searchProviderInstance){
                    bridgeSearch.addSearchProvider(searchProviderInstance);
                    bridgeMobileSearch.addSearchProvider(searchProviderInstance);
                }]);
            });
        }

        var deferred = $q.defer();
        bridgeDataService.initialize(deferred).then(function (data) {
            $rootScope.$emit('bridgeConfigLoaded', {});
            instantiateSerachProviders($injector, bridgeLoader.aSearchProvider);

            if (data !== undefined && data.bBackendCallFailed === true) {
                bridgeInBrowserNotification.addAlert("", "Loading the configuration from the backend failed. Bridge is using local settings.", 20);
            }

        });
}]);
