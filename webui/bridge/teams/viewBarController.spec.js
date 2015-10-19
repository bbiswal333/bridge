describe("viewBarController", function() {
	var controller, $scope, $httpBackend, $window, bridgeDataService, bridgeInBrowserNotification, $timeout, confirmDeleteDialog, deleteOnServer, $modal;

	beforeEach(function() {
		module("bridge.teams");
		inject(["$rootScope", "$controller", "$httpBackend", "$window", "bridgeDataService", "bridgeInBrowserNotification", "$timeout", function($rootScope, $controller, _httpBackend, _$window, _bridgeDataService, _bridgeInBrowserNotification, _$timeout) {
			$window = _$window;
			$scope = $rootScope.$new();
			$httpBackend = _httpBackend;
			bridgeInBrowserNotification = _bridgeInBrowserNotification;
			spyOn(bridgeInBrowserNotification, "addAlert");
			$timeout = _$timeout;
			bridgeDataService = _bridgeDataService;
			bridgeDataService.toDefault();
			bridgeDataService.getProjects().push({type: "TEAM", view: "viewId", viewName: "second view", apps: [], owner: "D049677"});
			bridgeDataService.getProjects().push({type: "TEAM", view: "notMyViewId", viewName: "second view", apps: [], owner: "D051804"});
			bridgeDataService.getUserInfo = function() { return {BNAME: "D049677"}; };
			confirmDeleteDialog = true;
			deleteOnServer = true;
			$modal = {
				open: function() {
					return {
						result: {
							then: function(acceptCallback, rejectCallback) {
								if(confirmDeleteDialog) {
									acceptCallback(deleteOnServer);
								} else if(rejectCallback) {
									rejectCallback();
								}
							}
						}
					};
				}
			};
			spyOn($modal, "open").and.callThrough();
			controller = $controller("bridge.viewBar.Controller", {$scope: $scope, $modal: $modal});
		}]);
	});

	it("should be instantiated", function() {
		expect(controller).toBeDefined();
	});

	it("should delete views in the backend if it's the own view and the popup was confirmed", function() {
		$httpBackend.expectGET('https://ifp.wdf.sap.corp/sap/bc/bridge/DELETE_VIEW?view=viewId&instance=server&origin=' + encodeURIComponent($window.location.origin))
			.respond(200, {error: false, message: "Deleted"});
		expect(bridgeDataService.getProjects().length).toEqual(3);
		$scope.deleteView("viewId").then(function() {
			expect(bridgeDataService.getProjects().length).toEqual(2);
		});
		$httpBackend.flush();
		expect($modal.open).toHaveBeenCalled();
	});

	it("should delete views locally if it's the own view and the popup was confirmed to delete only locally", function() {
		deleteOnServer = false;
		expect(bridgeDataService.getProjects().length).toEqual(3);
		$scope.deleteView("viewId").then(function() {
			expect(bridgeDataService.getProjects().length).toEqual(2);
		});
		expect($modal.open).toHaveBeenCalled();
	});

	it("should display a message if the view to be deleted was not found", function() {
		$scope.deleteView("notExistingView").then(function() {
			expect("This should not happen").toEqual(undefined);
		}, function() {
			expect(bridgeInBrowserNotification.addAlert).toHaveBeenCalledWith("danger", "View not found", 600);
		});
		$httpBackend.verifyNoOutstandingRequest();
		$timeout.flush();
	});

	it("should only remove a view from own list if it's not the own view", function() {
		expect(bridgeDataService.getProjects().length).toEqual(3);
		$scope.deleteView("notMyViewId").then(function() {
			expect(bridgeDataService.getProjects().length).toEqual(2);
		});
		$httpBackend.verifyNoOutstandingRequest();
	});
});
