angular.module("app.cats.allocationBarBlock", ["app.cats.allocationBar.utils", "lib.utils",
]).directive("app.cats.allocationbarBlock", ["app.cats.allocationBar.utils.colorUtils", "app.cats.allocationBar.utils.blockCalculations", "lib.utils.calUtils", function (colorUtils, blockCalculations, calUtils) {

    return {
        restrict: "E",
        scope: {
            blockData: "=",
            totalValue: "=",
            totalWidth: "=",
            getRemainingValue: "=",
        },
        replace: true,
        link: function ($scope, elem) {
            var originalBlockWidth;
            // we copy blockData.value to modify it for the UI. Don't Modify blockData directly too often as this is slow
            $scope.localValue = $scope.blockData.value;

            $scope.dragBarWidth = 2;
            $scope.blockColor = colorUtils.getNextColor();

            $scope.getValueAsPercentage = function () {
                return Math.round($scope.localValue / $scope.totalValue * 100);
            };
            $scope.getTimeText = function () {
                return calUtils.getTimeInWords((8 * 60) * ($scope.getValueAsPercentage() / 100), true);
            }

            if ($scope.blockData != undefined) {
                $scope.blockWidth = blockCalculations.getWidthFromValue($scope.blockData.value, $scope.totalWidth, $scope.totalValue);
                originalBlockWidth = $scope.blockWidth;
            }

            elem.find(".allocation-bar-dragBar").draggable({
                axis: 'x',
                drag: function (event, ui) {
                    $scope.$apply(function () {
                        var blockMetrics = blockCalculations.calculateBlockMetrics(ui.position.left, originalBlockWidth, $scope.totalWidth, $scope.blockData.value, $scope.getRemainingValue(), $scope.totalValue);

                        $scope.blockWidth = blockMetrics.newWidth;
                        $scope.localValue = blockMetrics.newValue;

                        // normally, jquery would position the dragged element using the left property. we don't need that as we change the width of the element
                        ui.position.left = 0;
                    });
                },
                stop: function (event, ui) {
                    $scope.$apply(function () {
                        // reset originalBlockwidth to the current blockWidth for the next dragging actions
                        originalBlockWidth = $scope.blockWidth;

                        // setting blockData is expensive (probably a lot of watches on this) so don't do it in the drag-handler
                        $scope.blockData.value = blockCalculations.getValueFromWidth($scope.blockWidth, $scope.totalWidth, $scope.totalValue);
                    });
                }
            });
        },
        templateUrl: "allocationBarBlockDirective.tmpl.html"
    };
}
]).run(["$templateCache", function ($templateCache) {
    $templateCache.put("allocationBarBlockDirective.tmpl.html",
        '<div ng-hide="blockData.value == 0">' +
            '<div class="allocation-bar-block" ng-style="{width: (blockWidth - dragBarWidth), background: blockColor}">' +
                '<div class="allocation-bar-project-text">{{blockData.desc}}</div>' +
                '<div class="allocation-bar-time-text">{{getTimeText()}} ({{getValueAsPercentage()}} %)</div>' +
            '</div>' +
            '<div class="allocation-bar-dragBar" ng-style="{width: dragBarWidth}">' +
                '<img class="allocation-bar-dragBar-image" src="img/bar_handler.svg"></img>' +
            '</div>' +
        '</div>'
    );
}]);