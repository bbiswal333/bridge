describe("The bridgeDataService", function () {
    var bridgeDataService;
    var $httpBackend;
    var $q,
        $window,
        bridgeInBrowserNotification;

    beforeEach(function () {

        module("bridge.service");

        inject(["$window", "$q", "$httpBackend", "bridgeDataService", "bridgeInstance", "bridge.service.appCreator", "bridgeInBrowserNotification", function (_$window, q, httpBackend, _bridgeDataService, bridgeInstance, appCreator, _bridgeInBrowserNotification) {
            bridgeDataService = _bridgeDataService;
            bridgeInBrowserNotification = _bridgeInBrowserNotification;
            spyOn(bridgeInBrowserNotification, "addAlert");

            $q = q;
            $window = _$window;

            $httpBackend = httpBackend;
            $httpBackend.whenGET('https://ifd.wdf.sap.corp/sap/bc/bridge/GETUSERCONFIG?instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin))
                .respond('{"projects":[{"name":"OVERVIEW","type":"PERSONAL","apps":[{"metadata":{"module_name": "app.atc","content":"app.atc","id":4,"show":true,"boxTitle":"ATC Results","boxIconClass":" icon-wrench"},"appConfig":{"configItems":[]}},{"metadata":{"module_name": "app.employee-search", "content":"app.employee-search","id":5,"show":true,"boxTitle":"Employee Search","boxIconClass":"icon-user-o"},"appConfig":{}}]},{"type": "TEAM", "view": "TeamView1", "owner": "D049677"},{"type": "TEAM", "view": "NotExistingView", "name": "Not Existing View", "owner": "D049677"}], "bridgeSettings": {"someFlag": true}}');
            $httpBackend.whenGET('https://ifd.wdf.sap.corp/sap/bc/bridge/GET_VIEW?view=TeamView1&owner=D049677&instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin))
                .respond('{"name": "Team View 1","apps":[{"metadata":{"module_name": "app.atc","content":"app.atc","id":4,"show":true,"boxTitle":"ATC Results","boxIconClass":" icon-wrench"},"appConfig":{"configItems":[]}}]}');
            $httpBackend.whenGET('https://ifd.wdf.sap.corp/sap/bc/bridge/GET_VIEW?view=NotExistingView&owner=D049677&instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin))
                .respond('{"error": true,"message": "Not found"}');
            $httpBackend.whenGET('https://ifd.wdf.sap.corp/sap/bc/bridge/GET_MY_DATA?origin=' + encodeURIComponent($window.location.origin)).respond("");

            bridgeDataService.initialize($q.defer());
            $httpBackend.flush();
        }]);

        $window.localStorage.clear();
    });

    it("should load config from backend and parse it", function () {
        expect(bridgeDataService.getProjects()[0]).toBeDefined();
        expect(bridgeDataService.getProjects()[0].apps.length).toEqual(1);
        expect(bridgeDataService.getBridgeSettings().someFlag).toBe(true);
        expect(bridgeInBrowserNotification.addAlert).toHaveBeenCalledWith("danger", "App not found: app.employee-search", 600);
    });

    it("should remove an app from the config by it's id", function() {
        expect(bridgeDataService.getAppById("app.atc-1")).toBeDefined();
        bridgeDataService.removeAppById("app.atc-1");
        expect(function() { bridgeDataService.getAppById("app.atc-1"); }).toThrow(new Error("App with ID app.atc-1 could not be found."));
    });

    it("should load data of projects that are referenced in the user config", function() {
        expect(bridgeDataService.getProjects()[1]).toBeDefined();
        expect(bridgeDataService.getProjects()[1].apps.length).toEqual(1);
        expect(bridgeDataService.getProjects()[1].name).toEqual("Team View 1");
    });

    it("should notify the user if a view could not be loaded", function() {
        expect(bridgeInBrowserNotification.addAlert).toHaveBeenCalledWith("error", "View could not be loaded: Not Existing View. Error: Not found", 600);
    });
});
