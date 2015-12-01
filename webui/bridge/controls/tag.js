angular.module('bridge.app').directive('bridge.tag', [function() {

    return {
        restrict: 'E',
        scope: {
        	exclude: '=',
            removeClick: '&'
        },
        transclude: true,
        templateUrl: 'bridge/controls/tag.html'
    };
}]);
