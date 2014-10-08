angular.module('bridge.app').directive('bridge.input', function() {

    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/input.html',
        replace: true,
        scope: {
            placeholder: '@?',
            type: '@?',
            model: '=?',
            change: '=?',
            blur: '&',
            focus: '&',
            maxlength: '@?'
        },
        link:function ($scope, element, attrs) {

            // set default type if not given by the directive-definition
            if (_.isUndefined(attrs.type)) {
				attrs.type = "text";
			}
        /*
            $scope.$parent.$watch(attrs.ngDisabled, function(newVal){
                $scope.disabled = newVal;
            });
            $scope.checkClicked = function(){
                if ($scope.disabled !== true) {
                    $scope.isChecked = !$scope.isChecked;
                }
            }; */
        }
    };
});
