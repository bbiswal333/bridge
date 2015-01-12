angular.module('app.securityTesting', ["app.securityTesting.data"]);
angular.module('app.securityTesting').directive('app.securityTesting', ['app.securityTesting.dataService', function (dataService) {

	var directiveController = ['$scope', function ($scope)
	{
		$scope.box.boxSize = "2";
		$scope.handleSecurityTestingResults = function() {
                    dataService.loadData().then(function () {
                        $.each(dataService.data.securityTestingData, function (index, element) {
                           
                            if (element.objecttype == 'codescan.fortify.open') {
                                $scope.fortify_open_issues = element.count;
                                if ($scope.fortify_closed_issues) {
                                    $scope.fortifyIssueProgress = Math.floor($scope.fortify_closed_issues / ($scope.fortify_open_issues + $scope.fortify_closed_issues) * 100);

                                }
                            }
                            if (element.objecttype == 'codescan.coverity.open') {
                                $scope.coverity_open_issues = element.count;
                                if ($scope.coverity_closed_issues) {
                                    $scope.coverityIssueProgress = Math.floor($scope.coverity_closed_issues / ($scope.coverity_open_issues + $scope.coverity_closed_issues) * 100);

                                }
                            }
                            if (element.objecttype == 'codescan.fortify.closed') {
                                $scope.fortify_closed_issues = element.count;
                                if ($scope.fortify_open_issues) {
                                    $scope.fortifyIssueProgress = Math.floor($scope.fortify_open_issues / ($scope.fortify_open_issues + $scope.fortify_closed_issues) * 100);

}
                            }
                            if (element.objecttype == 'codescan.coverity.closed') {
                                $scope.coverity_closed_issues = element.count;
                                if ($scope.coverity_open_issues) {
                                    $scope.coverityIssueProgress = Math.floor($scope.coverity_open_issues / ($scope.coverity_open_issues + $scope.coverity_closed_issues) * 100);

                                }
                            }
                            
                        });
			});
		};
		$scope.handleSecurityTestingResults();
		$scope.box.reloadApp($scope.handleSecurityTestingResults, 60 * 5);
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/securityTesting/overview.html',
		controller: directiveController
	};
}]);
