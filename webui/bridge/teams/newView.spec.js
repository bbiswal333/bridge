describe("newViewController", function() {
	var controller, $scope, $httpBackend, $window, guidService, bridgeDataService;

	beforeEach(function() {
		module("bridge.teams");
		inject(["$rootScope", "$controller", "$httpBackend", "$window", "bridge.service.guid", "bridgeDataService", function($rootScope, $controller, _httpBackend, _$window, _guidService, _bridgeDataService) {
			$window = _$window;
			guidService = _guidService;
			$scope = $rootScope.$new();
			$httpBackend = _httpBackend;
			bridgeDataService = _bridgeDataService;
			bridgeDataService.getUserInfo = function() { return {BNAME: "D049677"}};
			bridgeDataService.toDefault();
			controller = $controller("bridge.viewBar.newViewController", {$scope: $scope});

			guidService.get = function() {
				return "dummyGuid";
			};

			/*
			$httpBackend.whenGET(/https:\/\/ifd\.wdf\.sap\.corp\/sap\/bc\/bridge\/GETUSERCONFIG/)
                .respond('{"projects":[{"name":"OVERVIEW","type":"PERSONAL","apps":[{"metadata":{"module_name": "app.atc","content":"app.atc","id":4,"show":true,"boxTitle":"ATC Results","boxIconClass":" icon-wrench"},"appConfig":{"configItems":[]}},{"metadata":{"module_name": "app.employee-search", "content":"app.employee-search","id":5,"show":true,"boxTitle":"Employee Search","boxIconClass":"icon-user-o"},"appConfig":{}}]},{"type": "TEAM", "view": "TeamView1", "owner": "D049677"},{"type": "TEAM", "view": "NotExistingView", "name": "Not Existing View", "owner": "D049677"}], "bridgeSettings": {"someFlag": true}}');
            $httpBackend.whenGET(/https:\/\/ifd\.wdf\.sap\.corp\/sap\/bc\/bridge\/GET_MY_DATA/)
                .respond('{}');
            $httpBackend.whenGET(/https:\/\/ifd\.wdf\.sap\.corp\/sap\/bc\/bridge\/GET_VIEW/).respond("200", {apps: []});*/
		}]);
	});

	it("should be instantiated", function() {
		expect(controller).toBeDefined();
	});

	function expectPost() {
		$scope.viewName = "new View";

		$httpBackend.expectPOST('https://ifd.wdf.sap.corp/sap/bc/bridge/SET_VIEW?view=dummyGuid&viewName=new View&instance=server&origin=' + encodeURIComponent($window.location.origin),
        function validate(data){
            var oData = angular.fromJson(data);
            if (oData.apps.length === 0 && oData.name !== undefined){
                return true;
            } else {
                return false;
            }
        }).respond("200", {});

        $scope.createView();
		$httpBackend.flush();
	}

	it("should create a new view via backend call", function() {
		expectPost();
	});

	it("should create a new view and reflect it in the config", function() {
		expect(bridgeDataService.getProjects().length).toEqual(1);
		expectPost();
		expect(bridgeDataService.getProjects().length).toEqual(2);
		expect(bridgeDataService.getProjects()[1].apps.length).toEqual(0);
		expect(bridgeDataService.getProjects()[1].owner).toEqual("D049677");
	});
});
