describe("The bridge http interceptor", function () {
    var interceptor;
    var bridgeDataServiceMock;
    var $rootScope;
    var $http;

    beforeEach(function () {
        
        // mock away the bridgeDataService
        angular.module("mock.app", []).service("bridgeDataService", function () {
            this.clientModeActive = false;
            this.logModeActive = false;
            this.getClientMode = function () {
                return this.clientModeActive;
            };
            this.getLogMode = function () {
                return this.logModeActive;
            };
            this.initialize = function (deferredIn) {
                return deferredIn.promise;
            };
        });
        module("bridge.app");
        module("mock.app");

        sessionStorage.clear();

        inject(["$http", "$rootScope", "bridge.app.httpInterceptor", "bridgeDataService", function (_$http, _$rootScope, _interceptor, _bridgeDataService) {
            $http = _$http;
            $rootScope = _$rootScope;
            interceptor = _interceptor;
            bridgeDataServiceMock = _bridgeDataService;
        }]);

    });

    it("should add the current date to the request to avoid caching", function () {
        var mockConfig = {};
        mockConfig.url = "https://bridgeUnitTest.sap.corp";

        var changedConfig = interceptor.request(mockConfig);
        expect(changedConfig.url.indexOf("?")).not.toBe(-1);
    });

    it("should add the current date to the request that already contains a parameter to avoid caching", function () {
        var mockConfig = {};
        mockConfig.url = "https://bridgeUnitTest.sap.corp?parameter=123";

        var changedConfig = interceptor.request(mockConfig);
        expect(changedConfig.url.indexOf("&")).not.toBe(-1);
    });

    it("should reroute the call if client mode is active", function () {
        var mockConfig = {};
        mockConfig.url = "https://bridgeUnitTest.sap.corp?parameter=123";
        mockConfig.method = "GET";
        bridgeDataServiceMock.clientModeActive = true;

        var changedConfig = interceptor.request(mockConfig);

        expect(changedConfig.url.indexOf("https://localhost:1972/api/get?url=https%3A%2F%2FbridgeUnitTest.sap.corp%3Fparameter%3D123")).toBe(0);
    });

    it("should not reroute the call if it targets the client already", function () {
        var mockConfig = {};
        mockConfig.url = "https://localhost:1972?parameter=123";
        mockConfig.method = "GET";
        bridgeDataServiceMock.clientModeActive = true;

        var changedConfig = interceptor.request(mockConfig);

        expect(changedConfig.url.indexOf("https://localhost:1972?parameter=123")).toBe(0);
    });

    it("should remove the loading bar when there are no pending requests left", function () {
        $rootScope.showLoadingBar = true;
        $http.pendingRequests = [];
        var mockResponse = {};
        mockResponse.config = {};

        interceptor.response(mockResponse);

        expect($rootScope.showLoadingBar).toBe(false);
    });

    it("should not remove the loading bar when there are pending requests", function () {
        $rootScope.showLoadingBar = true;
        $http.pendingRequests = ["I am a pending Request"];
        var mockResponse = {};
        mockResponse.config = {};

        interceptor.response(mockResponse);

        expect($rootScope.showLoadingBar).toBe(true);
    });

    it("should log all external calls if we are in logMode", function () {
        var mockConfig = {};
        mockConfig.url = "https://localhost:1972?parameter=123";
        mockConfig.method = "GET";

        bridgeDataServiceMock.logModeActive = true;
        var changedConfig = interceptor.request(mockConfig);

        var log = JSON.parse(sessionStorage.getItem("bridgeLog"));
        expect(log[0].sType).toBe("Original Request");
        expect(log[0].sMessage).toBe('https://localhost:1972?parameter=123');

        expect(log[1].sType).toBe("Request");
        expect(log[1].sMessage.indexOf('{"url":"https://localhost:1972?parameter=123')).toBe(0);
        expect(log[1].sMessage.indexOf('"method":"GET"')).not.toBe(-1);
        expect(log[1].sStackTrace).not.toBe("");
    });

    it("should log all responses from external if we are in logMode", function () {
        var mockResponse = {};
        mockResponse.config = {
            url: "https://localhost:1972?parameter=123",
            method: "GET"
        };
        mockResponse.status = 200;
        mockResponse.headers = function () { return "abc"; }

        bridgeDataServiceMock.logModeActive = true;
        var changedConfig = interceptor.response(mockResponse);

        var log = JSON.parse(sessionStorage.getItem("bridgeLog"));
        expect(log[0].sType).toBe("Response");
        expect(log[0].sMessage.indexOf('"url":"https://localhost:1972?parameter=123')).not.toBe(-1);
        expect(log[0].sMessage.indexOf('"method":"GET"')).not.toBe(-1);
        expect(log[0].sMessage.indexOf('"status":200')).not.toBe(-1);
        expect(log[0].sStackTrace).not.toBe("");
    });


    it("should log all error-responses from external if we are in logMode", function () {
        var mockResponse = {};
        mockResponse.config = {
            url: "https://localhost:1972?parameter=123",
            method: "GET"
        };
        mockResponse.status = 404;
        mockResponse.headers = function () { return "abc"; }

        bridgeDataServiceMock.logModeActive = true;
        var changedConfig = interceptor.responseError(mockResponse);

        var log = JSON.parse(sessionStorage.getItem("bridgeLog"));
        expect(log[0].sType).toBe("Response Error");
        expect(log[0].sMessage.indexOf('"url":"https://localhost:1972?parameter=123')).not.toBe(-1);
        expect(log[0].sMessage.indexOf('"method":"GET"')).not.toBe(-1);
        expect(log[0].sMessage.indexOf('"status":404')).not.toBe(-1);
        expect(log[0].sStackTrace).not.toBe("");
    });
});