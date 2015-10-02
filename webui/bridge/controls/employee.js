angular.module('bridge.app').directive('bridge.employee', [function() {

    return {
        restrict: 'E',
        scope: {
        	id: '='
        },
        controller: ['$scope', 'employeeService', '$window', function($scope, employeeService, $window) {
        	$scope.$watch('id', function() {
        		employeeService.getData($scope.id).then(function(data) {
        			$scope.employee = data;
        		});
        	});
        }],
        templateUrl: 'bridge/controls/employee.html'
    };
}]);
