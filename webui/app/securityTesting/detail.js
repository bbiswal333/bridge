angular.module('app.securityTesting').controller('app.securityTesting.detailController',['$scope', '$routeParams', 'app.securityTesting.dataService',
	function Controller($scope, $routeParams, dataService) {
		$scope.results = [];
        $scope.handleResults = function () {
           
			dataService.loadDataDetailed($routeParams.system).then(function () {
                var aResults = null;
                
                aResults = dataService.data.securityTestingDetail;
              
              
                    $scope.results.length = 0;
                    for (var i = 0; i < aResults.length; i++) {
                        $scope.results.push({ "projectname": aResults[i].projectname, "open": aResults[i].open});
                    }
                });
		};
		$scope.handleResults();
}]);
