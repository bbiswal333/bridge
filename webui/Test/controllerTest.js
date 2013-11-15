var  injector = angular.injector(['ng', 'dashboardBox']);
var init = {
		setup: function() {
			this.$scope = injector.get('$rootScope').$new();
		}
};

module("Controller", init);
test( "test dashboardBoxController", function() {
	var $controller = injector.get('$controller');
	var atcDataProviderMock = {
			getResultForConfig: function(config) {
				return {
					prio1: 644,
					prio2: 13,
					prio3: 1234,
					prio4: 1
				};
			}
	};
	
	$controller('Controller', {$scope: this.$scope, ATCDataProvider: atcDataProviderMock, Config: new Config() });
	
	equal(this.$scope.data.prio1, 644, 'Controller scope loaded');
});

//test("doSearch dashboardBoxController", function () {
//    var $controller = injector.get('$controller');


//    $controller('Controller', { $scope: this.$scope, ATCDataProvider: atcDataProviderMock, Config: new Config() });

//    equal(this.$scope.data.prio1, 644, 'Controller scope loaded');
//});