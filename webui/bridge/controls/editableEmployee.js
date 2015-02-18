angular.module('bridge.app').directive('bridge.editableEmployee', [function() {

    return {
        restrict: 'E',
        scope: {
        	employee: '=?'
        },
        controller: ['$scope', function($scope) {
        	$scope.editMode = false;
        	$scope.toggleEditMode = function() {
        		$scope.editMode = !$scope.editMode;
        	};

        	$scope.deactivateEditMode = function() {
        		$scope.editMode = false;
        	};

            $scope.handleEmployeeSelection = function(selectedEmployee) {
                $scope.employee = selectedEmployee;
                $scope.deactivateEditMode();
            };
        }],
        templateUrl: 'bridge/controls/editableEmployee.html'
    };
}]);
