bridgeApp.directive('box', function ($compile, bridgeDataService) {

    return {
        restrict: 'E',
        templateUrl: 'control/box/BoxDirective.html',
        //controller: directiveController,
        scope: true,
        link: function ($scope, $element, $attrs, $modelCtrl) {

            if ($attrs.id) {
                if (!bridgeDataService.boxInstances[$attrs.id]) {
                    $scope.boxId = $attrs.id;
                    bridgeDataService.boxInstances[$attrs.id] = {
                        scope: $scope,
                        initializationTries: 0,
                    };
                }
            }
            else {
                console.error("Box has no id!");
            }

            var newElement = $compile("<" + $attrs.content + "/>")($scope);
            $element.children().children().children().append(newElement);

            if ($attrs.id) {
                bridgeDataService.boxInstances[$attrs.id].element = newElement;
            }
        }
    };
});