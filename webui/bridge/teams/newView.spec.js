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
			controller = $controller("bridge.viewBar.newViewController", {$scope: $scope, $modalInstance: {close: function() {}}});
			spyOn(bridgeDataService, "addProject");

			guidService.get = function() {
				return "dummyGuid";
			};
		}]);
	});

	it("should be instantiated", function() {
		expect(controller).toBeDefined();
	});

	function expectPost() {
		$httpBackend.expectPOST('https://ifp.wdf.sap.corp/sap/bc/bridge/SET_VIEW?view=dummyGuid&viewName=new View&instance=server&origin=' + encodeURIComponent($window.location.origin),
        function validate(data){
            var oData = angular.fromJson(data);
            if (oData.apps.length === 0 && oData.name !== undefined){
                return true;
            } else {
                return false;
            }
        }).respond("200", {});

        $scope.createView("new View");
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
		$scope.assignView({VIEW_ID: "someID", OWNER: "D049677"});
		expect(bridgeDataService.addProject).toHaveBeenCalledWith("someID");
	});

	it("should not assign an a view if it was not picked, from the list of found views", function() {
		$scope.assignView("some name");
		expect(bridgeDataService.addProject).not.toHaveBeenCalled();
	});
});
