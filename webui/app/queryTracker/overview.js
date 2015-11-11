angular.module('app.querytracker', []);
angular.module('app.querytracker').directive('app.querytracker',['app.querytracker.queryData', function (queryDataService) {

	var directiveController = ['$scope', function ($scope) {
		$scope.data = queryDataService.queryData;

		if (queryDataService.isInitialized.value === false) {
			queryDataService.loadQueryData();
		}

		$scope.getAmountDueQueries = function(){
			return queryDataService.getQueriesWithinDeadline().length;
		};

		function reloadTicketData(){
			queryDataService.loadQueryData();
		}

		$scope.box.reloadApp(reloadTicketData, 60 * 10);
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/queryTracker/overview.html',
		controller: directiveController
	};
}]);
