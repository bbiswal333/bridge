angular.module('bridge.app').directive('bridge.checkbox', function() {

    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/checkbox.html',
        scope: {
            checkedLabel: '@',
            uncheckedLabel: '@',
            isChecked: '=',
            checkToggle: '&'
        },
        link:function ($scope, element, attrs) {
            if (attrs.ngDisabled !== undefined) {
                $scope.$parent.$watch(attrs.ngDisabled, function (newVal) {
                    $scope.disabled = newVal;
                });
            }
            if(attrs.checkToggle === undefined) {
                $scope.checkToggle = undefined;
            }
            $scope.checkClicked = function(){
                if ($scope.disabled !== true) {
                    $scope.isChecked = !$scope.isChecked;
                }
            };
        }
    };
});
