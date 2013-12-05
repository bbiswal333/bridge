﻿dashboardBox.directive('box', function ($compile) {

    var directiveController = ['$scope', function ($scope) {

    }];

    return {
        restrict: 'E',
        templateUrl: 'Controls/BoxDirective.html',
        controller: directiveController,
        link: function ($originalScope, $element, $attrs, $modelCtrl) {
            var newElement = $compile("<" + $attrs.content + "/>")($originalScope);
            $element.children().append(newElement);
        }
    };
});