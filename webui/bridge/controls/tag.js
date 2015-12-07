angular.module('bridge.app').directive('bridge.tag', [function() {

    return {
        restrict: 'E',
        scope: {
        	exclude: '=',
            removeClick: '&',
            removable: '@'
        },
        transclude: true,
        templateUrl: 'bridge/controls/tag.html',
		compile: function(element, attrs){
			if (!attrs.removable) { attrs.removable = true; }
		}
    };
}]);
