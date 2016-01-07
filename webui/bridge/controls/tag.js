angular.module('bridge.app').directive('bridge.tag', [function() {

    return {
        restrict: 'E',
        scope: {
        	exclude: '=',
            removeClick: '&',
            removable: '@?'
        },
        transclude: true,
        templateUrl: 'bridge/controls/tag.html',
        link: function (scope, element, attrs) {
			if (attrs.removable === undefined) {
                attrs.removable = true;
                scope.removable = true;
            }
		}
    };
}]);
