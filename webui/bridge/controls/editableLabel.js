angular.module('bridge.app').directive('bridge.editableLabel', [function() {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
        	text: '=',
            ownEditControl: '=',
            readonly: '=',
            onTextChanged: '&'
        },
        controller: ['$scope', function($scope) {
            // we cannot bind $scope.text directly to the model of Bridge-Input, because it is a simple string and
            // would be passed as a copy and thus not get updated. Wrap it in an object, so that it is passed as a reference
            $scope.oPassToBridgeInput = {
                text: $scope.text
            };

            $scope.$watch("oPassToBridgeInput", function(){
                $scope.text = $scope.oPassToBridgeInput.text;
            }, true);

        	$scope.editMode = false;
        	$scope.toggleEditMode = function() {
                if(!$scope.readonly) {
        		  $scope.editMode = !$scope.editMode;
                }
        	};

        	$scope.deactivateEditMode = function() {
        		$scope.editMode = false;
        	};

            $scope.$watch('editMode', function(oldValue, newValue) {
                if($scope.onTextChanged && $scope.editMode === false) {
                    $scope.onTextChanged();
                }
            });
        }],
        templateUrl: 'bridge/controls/editableLabel.html'
    };
}]);
