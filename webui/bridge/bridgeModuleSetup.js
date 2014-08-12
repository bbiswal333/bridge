angular.module('bridge.app').config(["$provide", "$routeProvider", "$compileProvider", "$locationProvider", "$httpProvider", "lib.utils.calUtilsProvider", "bridge.service.loaderProvider",
    function ($provide, $routeProvider, $compileProvider, $locationProvider, $httpProvider, calUtils, bridgeLoaderServiceProvider) {

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
            // decorate all the common logging methods
            ['log', 'debug', 'info', 'warn', 'error'].forEach(function (logFunction) {
                $delegate[logFunction] = docorateLogger($delegate[logFunction]);
                $delegate[logFunction].logs = []; // needed for angularMocks, without this, unit test will fail
            });
            return $delegate;

            function docorateLogger(originalFn) {
                return function () {
                    // https://shifteleven.com/articles/2007/06/28/array-like-objects-in-javascript/
                    var args = Array.prototype.slice.call(arguments);
                    var logProvider = $injector.get("bridge.diagnosis.logService");
                    logProvider.log(args[0]);

                    originalFn.apply(null, args);
                };
            }
        }]);

        $routeProvider.when("/diagnosis", {
            templateUrl: 'bridge/diagnosis/corsTestPage.html',
            controller: 'bridge.diagnosis.corsTestPageController'
        });

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
    $rootScope.$on("$locationChangeStart", function (event, args) {
        $rootScope.$broadcast('closeSettingsScreenRequested', args);
    });

    if ($location.search().clientMode === "true") {
        bridgeDataService.setClientMode(true);
    }
    if ($location.search().logMode === "true") {
        bridgeDataService.setLogMode(true);
    }

    var deferred = $q.defer();
    bridgeDataService.initialize(deferred).then(function () {
        $rootScope.$emit('bridgeConfigLoaded', {});
    }, function () { // promise rejected = config load failed
        bridgeInBrowserNotification.addAlert("danger", "Bridge could not load your configuration. Most of the times, this is the case when you use Firefox and have not configured it correctly. Please see in our <a href='https://github.wdf.sap.corp/bridge/bridge/wiki/Browser-Support'>Wiki</a> how to do that.", 600);
    });
});