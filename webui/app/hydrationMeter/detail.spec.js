describe("The detail controller", function () {

	var scope, dataService, controllerService;

	beforeEach(angular.mock.module("app.hydrationMeter"));
	beforeEach(inject(["app.hydrationMeter.dataService", function (_dataService_) {
		 dataService = _dataService_;
	}]));
	beforeEach(inject(function ($rootScope, $controller) {

        scope = $rootScope.$new();
        controllerService = $controller;

        controllerService("app.hydrationMeter.detailController", {$scope: scope});

    }));

	it("should set the text from the data service", function () {
		expect(scope.text).toBe(dataService.getText());
	});

});
