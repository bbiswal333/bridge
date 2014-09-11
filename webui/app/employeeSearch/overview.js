angular.module('app.employeeSearch', []);

angular.module('app.employeeSearch').directive('app.employeeSearch', ['$http', '$window', 'bridge.employeeSearch', function ($http, $window, employeeSearch) {

    var directiveController = ['$scope', function ($scope) {
        $scope.box.boxSize = "2";

	    $scope.copyClipboard = function(text)
		{
			$http.get($window.client.origin + '/api/client/copy?text=' + encodeURIComponent(text));
		};

		$scope.$watch('selectedEmployee', function () {
            if($scope.selectedEmployee === "tetris")
            {
            	$window.location.href = '#/tetris';
            }
        }, true);

        $scope.onSelect = function ($item) {
            // FIND_EMPLOYEE_JSON service call with id as a parameter returns more details about the user. We need TELNR.
            employeeSearch.getDetails($item, function(employeeDetails) {
                $scope.selectedEmployee = employeeDetails;
            });
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
}]);
