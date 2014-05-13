describe("The bridgeConfig handles loading/saving/displaying of the configuration", function () {
    var mockTemplatePath = "myMockTemplatePath";
    var mockController = "myMockController";

    var bridgeConfig;
    var bridgeDataService;
    var $rootScope;
    var $httpBackend;
    var $q;

    beforeEach(function () {

        module("bridge.service");

        inject(["$rootScope", "$q", "$httpBackend", "$templateCache", "bridgeConfig", "bridgeDataService", function (rootScope, q, httpBackend, $templateCache, _bridgeConfig, _bridgeDataService) {
            bridgeConfig = _bridgeConfig;
            bridgeDataService = _bridgeDataService;
            $rootScope = rootScope;
            $q = q;

            $httpBackend = httpBackend;
            $httpBackend.whenGET("https://ifp.wdf.sap.corp:443/sap/bc/devdb/GETUSRCONFIG?new_devdb=B&origin=" + encodeURIComponent(location.origin)).respond('{"projects":[{"name":"OVERVIEW","type":"PERSONAL","apps":[{"metadata":{"content":"app.lunch-walldorf","id":2,"show":true,"boxTitle":"Lunch Wdf / Rot","boxIconClass":"icon-meal"},"appConfig":{}},{"metadata":{"content":"app.jira","id":3,"show":true,"boxTitle":"Jira","boxIconClass":"icon-bell"},"appConfig":{}},{"metadata":{"content":"app.atc","id":4,"show":true,"boxTitle":"ATC Results","boxIconClass":" icon-wrench"},"appConfig":{"configItems":[]}},{"metadata":{"content":"app.employee-search","id":5,"show":true,"boxTitle":"Employee Search","boxIconClass":"icon-user-o"},"appConfig":{}}]}], "bridgeSettings": {"someFlag": true}}');
        }]);
    });

    it("Check load config from backend and parse it", function () {
        var deferred = $q.defer();
        var promise = bridgeDataService.initialize(deferred);
        promise.then(function () {
            expect(bridgeDataService.getProjects()[0].apps.length).toBe(4);
            expect(bridgeDataService.getBridgeSettings().someFlag).toBe(true);
        }, function () {
            console.error("fuck");
        });
        $httpBackend.flush();
    });
});