angular.module('app.querytracker').controller('app.querytracker.detailController',['$scope', '$routeParams', 'app.querytracker.queryData',
	function Controller($scope, $routeParams, queryDataService) {
		if (queryDataService.isInitialized.value === false) {
			queryDataService.loadQueryData();
		}

		if ($routeParams.onlyDeadline === 'true'){
			$scope.data = queryDataService.getQueriesWithinDeadline();
		} else {
			$scope.data = queryDataService.queryData;
		}

		$scope.title = "blub";

		$(".box-title").text("Queries I need to answer");
}]);
