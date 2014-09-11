angular.module('app.employeeSearch', []);

angular.module('app.employeeSearch').directive('app.employeeSearch', ['bridge.search', '$modal', '$http', '$window', 'bridge.employeeSearch', function (bridgeSearch, $modal, $http, $window, employeeSearch) {

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

        bridgeSearch.addSearchProvider({
            getSourceName: function() {
                return "SAP Employees";
            },
            findMatches: function(query, resultArray) {
                return employeeSearch.doSearch(query, function(employees) {
                    employees.map(function(employee) {
                        resultArray.push({title: employee.VORNA + " " + employee.NACHN, description: employee.BNAME, originalEmployee: employee});
                    });
                });
            },
            getCallbackFn: function() {
                return function(selectedEmployee) {
                    $scope.onSelect(selectedEmployee.originalEmployee);
                };
            }
        });
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
}]);
