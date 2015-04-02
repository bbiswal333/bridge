angular.module('bridge.app').directive('bridge.editableLabel', [function() {

    return {
        restrict: 'E',
        scope: {
        	text: '='
        },
        controller: ['$scope', function($scope) {
        	$scope.editMode = false;
        	$scope.toggleEditMode = function() {
        		$scope.editMode = !$scope.editMode;
        	};

        	$scope.deactivateEditMode = function() {
        		$scope.editMode = false;
        	};
        }],
        templateUrl: 'bridge/controls/editableLabel.html'
    };
}]);