angular.module('bridge.app')
  .directive('bridge.radio', function() {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/radio.html',
        scope: {
            label: '@',
            isChecked: '&',
            checkToggle: '&?'
        },
        link:function ($scope) {
            $scope.radioClick = function(){
                if ($scope.checkToggle !== undefined){
                    $scope.checkToggle();
                }
            };
        }
    };
});
