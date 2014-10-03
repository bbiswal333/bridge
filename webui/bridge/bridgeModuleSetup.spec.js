describe("The bridge config", function () {
    var $route;
    var $q;
    var $log;
    var bridgeDataService;

    beforeEach(function () {
        module("bridge.app");
        module("bridge.service");

        sessionStorage.clear();

        inject(["$route", "$q", "$log", "bridgeDataService", function (_$route, _$q, _$log, _bridgeDataService) {
            $route = _$route;
            $q = _$q;
            $log = _$log;
            bridgeDataService = _bridgeDataService;
        }]);
    });

    it("should register routes for detail pages", function () {
        expect($route.routes['/detail/atc/:appId/:prio'].templateUrl).toBe('view/detail.html'); // navigate to the general detail screen
    });

    it("should pass the correct data to the detail pages", function () {
        var routeMock = {
            current: {
                app: $route.routes['/detail/atc/:appId/:prio'].app,
                info: $route.routes['/detail/atc/:appId/:prio'].info
            }
        };


        var promise = $route.routes['/detail/atc/:appId/:prio'].resolve.appInfo($q, routeMock);
        promise.then(function success(data) {
            expect(data.module_name).toBe("app.atc");
            expect(data.needs_client).toBe(false);
        }, function error() {
            expect("Promise").toBe("rejected");
        });
    });

    it("should extend the angular $log service to log to the session storage", function () {
        bridgeDataService.setLogMode(true);
        $log.log("Test log message");
        var log = JSON.parse(sessionStorage.getItem("bridgeLog"));
        expect(log[0].sMessage).toBe("Test log message");
    });
});
