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
			bridgeDataService.getUserInfo = function() { return {BNAME: "D049677"}; };
			bridgeDataService.toDefault();
			controller = $controller("bridge.viewBar.newViewController", {$scope: $scope});
			spyOn(bridgeDataService, "addProjectFromOwner");

			guidService.get = function() {
				return "dummyGuid";
			};
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

	it("should assign an existing view", function() {
		$scope.existingView = {VIEW_ID: "someID", OWNER: "D049677"};
		$scope.assignView();
		expect(bridgeDataService.addProjectFromOwner).toHaveBeenCalledWith("someID", "D049677");
	});

	it("should not assign an a view if it was not picked, from the list of found views", function() {
		$scope.existingView = "some name";
		$scope.assignView();
		expect(bridgeDataService.addProjectFromOwner).not.toHaveBeenCalled();
	});
});
