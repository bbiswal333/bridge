describe("The bridgeDataService", function () {
    var bridgeDataService;
    var $httpBackend;
    var $q,
        $window;

    beforeEach(function () {

        module("bridge.service");

        inject(["$window", "$q", "$httpBackend", "bridgeDataService", "bridgeInstance", "bridge.service.appCreator", function (_$window, q, httpBackend, _bridgeDataService, bridgeInstance, appCreator) {
            bridgeDataService = _bridgeDataService;
            $q = q;
            $window = _$window;

            $httpBackend = httpBackend;
            $httpBackend.whenGET('https://ifp.wdf.sap.corp/sap/bc/bridge/GETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin))
                .respond('{"projects":[{"name":"OVERVIEW","type":"PERSONAL","apps":[{"metadata":{"module_name": "app.lunchWalldorf","content":"app.lunch-walldorf","id":2,"show":true,"boxTitle":"Lunch Wdf / Rot","boxIconClass":"icon-meal"},"appConfig":{}},{"module_name": "app.jira","metadata":{"content":"app.jira","id":3,"show":true,"boxTitle":"Jira","boxIconClass":"icon-bell"},"appConfig":{}},{"metadata":{"module_name": "app.atc","content":"app.atc","id":4,"show":true,"boxTitle":"ATC Results","boxIconClass":" icon-wrench"},"appConfig":{"configItems":[]}},{"metadata":{"content":"app.employee-search","id":5,"show":true,"boxTitle":"Employee Search","boxIconClass":"icon-user-o"},"appConfig":{}}]}], "bridgeSettings": {"someFlag": true}}');
            $httpBackend.whenGET('https://ifp.wdf.sap.corp/sap/bc/bridge/GET_MY_DATA?origin=' + encodeURIComponent($window.location.origin)).respond("");
            appCreator.createInstance = function(metadata) {
                var app = {
                    metadata: metadata
                };
                app.metadata.guid = metadata.module_name + "-1";
                return app;
            };

            bridgeDataService.initialize($q.defer());
            $httpBackend.flush();
        }]);

        $window.localStorage.clear();
    });

    it("Check load config from backend and parse it", function () {
        expect(bridgeDataService.getBridgeSettings().someFlag).toBe(true);
    });

    it("should remove an app from the config by it's id", function() {
        expect(bridgeDataService.getAppById("app.lunchWalldorf-1")).toBeDefined();
        bridgeDataService.removeAppById("app.lunchWalldorf-1");
        expect(function() { bridgeDataService.getAppById("app.lunchWalldorf-1"); }).toThrow(new Error("App with ID app.lunchWalldorf-1 could not be found."));
    });
});
