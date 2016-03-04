angular.module('bridge.app').directive('bridge.tag', [function() {

    return {
        restrict: 'E',
        scope: {
        	exclude: '=',
            excludable: '@?',
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
            if (attrs.excludable === undefined) {
                attrs.excludable = true;
                scope.excludable = true;
            }
		}
    };
}]);
