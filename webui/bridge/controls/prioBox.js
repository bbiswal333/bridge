angular.module('bridge.app')
  .directive('bridge.prioBox', function() {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/prioBox.html',
        replace: true,
        scope: {
            prio: '@',
            value: '=',
            navigateTo: '@',
            label: '@',
            hasSettings: '='
        }
    };
});
