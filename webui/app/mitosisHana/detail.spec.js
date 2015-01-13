describe("The detail controller", function () {

	var scope, dataService, controllerService;

	beforeEach(angular.mock.module("app.mitosisHana"));
	beforeEach(inject(["app.mitosisHana.dataService", function (_dataService_) {
		 dataService = _dataService_;
	}]));
	beforeEach(inject(function ($rootScope, $controller) {

        scope = $rootScope.$new();
        controllerService = $controller;

        controllerService("app.mitosisHana.detailController", {$scope: scope});

    }));

});
