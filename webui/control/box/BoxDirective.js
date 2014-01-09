var boxInstances = {};

setInterval(function () {
    for (var box in boxInstances) {
        if (boxInstances[box].scope && boxInstances[box].scope.loadData) {
            boxInstances[box].scope.loadData();
        }
    }
}, 5000);

bridgeApp.directive('box', function ($compile) {

    var directiveController = ['$scope', function ($scope) {}];

    return {
        restrict: 'E',
        templateUrl: 'control/box/BoxDirective.html',
        controller: directiveController,
        scope: true,
        link: function ($scope, $element, $attrs, $modelCtrl) {

            if ($attrs.id) {
                if (!boxInstances[$attrs.id]) {
                    boxInstances[$attrs.id] = {
                        scope: $scope
                    };
                }
            }
            else {
                console.error("Box has no id!");
            }

            var newElement = $compile("<" + $attrs.content + "/>")($scope);
            $element.children().append(newElement);

            if ($attrs.id) {
                boxInstances[$attrs.id].element = newElement;
            }


            //var elementScope = $scope;
            //if ($attrs.id) {
            //    if (!boxInstances[$attrs.id]) {
            //        elementScope = $scope.$new();
            //        boxInstances[$attrs.id] = {
            //            scope: elementScope
            //        };
            //    }
            //    else {
            //        elementScope = boxInstances[$attrs.id].scope;
            //    }
            //}
            //else {
            //    console.error("Box has no id!");
            //}

            //var newElement = $compile("<" + $attrs.content + "/>")(elementScope);
            //$element.children().append(newElement);

            //if ($attrs.id) {
            //    boxInstances[$attrs.id].element = newElement;
            //}

            /*
            var elementScope = $scope;
            if ($attrs.id) {
                if (!boxInstances[$attrs.id]) {
                    elementScope = $scope.$new();
                    boxInstances[$attrs.id] = {
                        scope: elementScope
                    };
                }
                else {
                    elementScope = boxInstances[$attrs.id].scope;
                    elementScope.$$watchers = null;
                }
            }
            else {
                console.error("Box has no id!");
            }

            var newElement = $compile("<" + $attrs.content + "/>")(elementScope);
            $element.children().append(newElement);

            if ($attrs.id) {
                boxInstances[$attrs.id].element = newElement;
            }*/


            //var elementScope = $scope;
            //var element = null;

            //if ($attrs.id) {
            //    if (!boxInstances[$attrs.id]) {
            //        elementScope = $scope.$new();
            //        element = $compile("<" + $attrs.content + "/>")(elementScope);
            //        boxInstances[$attrs.id] = {
            //            element: element,
            //            scope: elementScope
            //        };
            //    }
            //    else {
            //        elementScope = boxInstances[$attrs.id].scope;
            //        element = boxInstances[$attrs.id].element;
            //    }
            //}
            //else {
            //    console.error("Box has no id!");
            //}

            //$element.children().append(element);
        }
    };
});