angular.module("app.cats.allocationBarBlock", ["app.cats.allocationBar.utils", "lib.utils"
]).directive("app.cats.allocationbarBlock", ["app.cats.allocationBar.utils.colorUtils", "app.cats.allocationBar.utils.blockCalculations", "lib.utils.calUtils",
function (colorUtils, blockCalculations, calUtils) {

    return {
        restrict: "E",
        scope: {
            blockData: "=",
            totalValue: "=",
            totalWidth: "=",
            getRemainingValue: "=",
            getBlockIndex: "=",
            blockSizeChangeRequested: "=",
            applyChangesInBlocks: "="
        },
        replace: true,
        link: function ($scope, elem) {
            var originalBlockWidth;
            // we copy blockData.value to modify it for the UI. Don't Modify blockData directly too often as this is slow
            $scope.blockData.localValue = $scope.blockData.value;

            $scope.dragBarWidth = 5;
            $scope.blockColor = colorUtils.getColorForBlock($scope.blockData);

            $scope.getValueAsPercentage = function () {
                return Math.round($scope.blockData.localValue / $scope.totalValue * 1000) / 10;
            };

            // Do not show time due to part time and mixed part time/ full time maintenance
            $scope.getTimeText = function () {
                return "";// calUtils.getTimeInWords((8 * 60) * ($scope.getValueAsPercentage() / 100), true);
            };
            $scope.setWidth = function(width) {
                $scope.blockData.blockWidth = width;
            };

            elem.find(".allocation-bar-dragBar").draggable({
                axis: 'x',
                drag: function (event, ui) {
                    $scope.$apply(function () {
                        $scope.blockSizeChangeRequested($scope.blockData, ui.position.left, originalBlockWidth);
                        // normally, jquery would position the dragged element using the left property. we don't need that as we change the width of the element
                        ui.position.left = 0;
                    });
                },
                stop: function () {
                    $scope.$apply(function () {
                        // setting blockData is expensive (probably a lot of watches on this) so don't do it in the drag-handler
                        $scope.applyChangesInBlocks();
                    });
                }
            });

            $scope.$watch("blockData.value", function () {
                $scope.blockData.blockWidth = blockCalculations.getWidthFromValue($scope.blockData.value, $scope.totalWidth, $scope.totalValue);
                // reset originalBlockwidth to the current blockWidth for the next dragging actions
                originalBlockWidth = $scope.blockData.blockWidth;
                $scope.blockData.localValue = $scope.blockData.value;
            });
        },
        templateUrl: "allocationBarBlockDirective.tmpl.html"
    };
}
]).run(["$templateCache", function ($templateCache) {
    $templateCache.put("allocationBarBlockDirective.tmpl.html",
        '<div ng-hide="blockData.value == 0">' +
            '<div class="allocation-bar-block" ng-style="{width: (blockData.blockWidth - dragBarWidth), background: blockColor}">' +
                '<div class="allocation-bar-project-text">{{blockData.desc}}</div>' +
                '<div class="allocation-bar-time-text">{{getValueAsPercentage()}} %</div>' +
            '</div>' +
            '<div class="allocation-bar-dragBar" ng-style="{width: dragBarWidth}">' +
                '<div ng-style="{background: blockColor}" style="height: 60px; margin-top: 10px;">' + 
                    '<img ng-hide="blockData.fixed" class="allocation-bar-dragBar-image" src="img/bar_handler.svg"></img>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}]);