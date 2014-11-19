// describe("The Jenkins settings controller", function() {
// 	var $controller,
// 		$filter,
// 		ngTableParams,
// 		$rootScope,
// 		jenkinsConfigService;

// 	beforeEach(function(){
// 		module("ngTable");
// 		module("app.jenkins");

// 		inject(["$controller", "$filter", "ngTableParams", "$rootScope", "app.jenkins.configservice", function(_$controller, _$filter, _ngTableParams, _$rootScope, _jenkinsConfigService){
// 			$controller = _$controller;
// 			$filter = _$filter;
// 			ngTableParams = _ngTableParams;
// 			$rootScope = _$rootScope;
// 			jenkinsConfigService = _jenkinsConfigService;
// 		}]);

// 		$controller("app.jenkins.settingsController", {
// 			"$filter": $filter,
// 			"ngTableParams": ngTableParams,
// 			"$scope": $rootScope,
// 			"app.jenkins.configservice": jenkinsConfigService
// 		});
// 	});

// 	it("should show empty input fields", function(){
// 		expect($rootScope.jobDiscoveryData.jenkinsUrl).toBe("");
// 		expect($rootScope.jobDiscoveryData.selectedView).toBe("");
// 		expect($rootScope.jobDiscoveryData.selectedJob).toBe("");
// 	});
// });
