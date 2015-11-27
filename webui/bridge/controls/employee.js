angular.module('bridge.app').directive('bridge.employee', [function() {

    return {
        restrict: 'E',
        scope: {
        	id: '='
        },
        controller: ['$scope', 'employeeService', function($scope, employeeService) {
        	$scope.$watch('id', function() {
        		employeeService.getData($scope.id).then(function(data) {
        			$scope.employee = data;
        		});
        	});
        }],
        templateUrl: 'bridge/controls/employee.html'
    };
}]);
