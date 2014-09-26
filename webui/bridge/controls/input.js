angular.module('bridge.app').directive('bridge.input', function() {

    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/input.html',
        replace: true,
        scope: {
            placeholder: '@?',
            model: '=?',
            change: '=?',
            blur: '&',
            focus: '&'
        }
        /*link:function ($scope, element, attrs) {
            $scope.$parent.$watch(attrs.ngDisabled, function(newVal){
                $scope.disabled = newVal;
            });
            $scope.checkClicked = function(){
                if ($scope.disabled !== true) {
                    $scope.isChecked = !$scope.isChecked;
                }
            };
        }*/
    };
});
