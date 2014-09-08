angular.module("app.cats.allocationBarBlock", ["app.cats.allocationBar.utils", "lib.utils"
]).directive("app.cats.allocationbarBlock", ["app.cats.allocationBar.utils.colorUtils", "app.cats.allocationBar.utils.blockCalculations", "lib.utils.calUtils",
function (colorUtils, blockCalculations, calUtils) {

    return {
        restrict: "E",
        scope: {
            blockData: "=",
            selectedHours: "=",
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

            $scope.getDescription = function () {
                if ($scope.blockData.task.ZCPR_EXTID && $scope.blockData.task.RAUFNR) {
                    return $scope.blockData.desc + ",\n" + $scope.blockData.task.ZCPR_EXTID + ",\n" + $scope.blockData.task.RAUFNR;
                } else if ($scope.blockData.task.ZCPR_EXTID) {
                    return $scope.blockData.desc + ",\n" + $scope.blockData.task.ZCPR_EXTID;
                } else if ($scope.blockData.task.RAUFNR && $scope.blockData.desc !== $scope.blockData.task.RAUFNR) {
                    return $scope.blockData.desc + ",\n" + $scope.blockData.task.RAUFNR;
                } else if ($scope.blockData.task.TASKTYPE && $scope.blockData.desc !== $scope.blockData.task.TASKTYPE) {
                    return $scope.blockData.desc + ",\n" + $scope.blockData.task.TASKTYPE;
                } else {
                    return $scope.blockData.desc;
                }
            };

            $scope.getValueAsPercentage = function () {
                return Math.round($scope.blockData.localValue / $scope.totalValue * 1000) / 10;
            };

            $scope.getValueAbsolute = function () {
                return calUtils.getTimeInWords(Math.round($scope.selectedHours * $scope.blockData.localValue * 1000) / 1000 * 60, true, true);
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
//            '<div class="allocation-bar-block" ng-style="{width: (blockData.blockWidth - dragBarWidth), background: blockColor}" title="{{getDescription()}} {{getValueAsPercentage()}} % ({{getValueAbsolute()}})" popover="{{getDescription()}} {{getValueAsPercentage()}} % ({{getValueAbsolute()}})" popover-placement="top" popover-trigger="mouseenter" popover-popup-delay="1500">' +
            '<div class="allocation-bar-block" ng-style="{width: (blockData.blockWidth - dragBarWidth), background: blockColor}" title="{{getDescription()}}&#013;&#010;{{getValueAsPercentage()}} % ({{getValueAbsolute()}})">' +
                '<div class="allocation-bar-project-text">{{blockData.desc}}</div>' +
                '<div class="allocation-bar-time-text">{{getValueAsPercentage()}} % ({{getValueAbsolute()}})</div>' +
            '</div>' +
            '<div class="allocation-bar-dragBar" ng-style="{width: dragBarWidth}">' +
                '<div ng-style="{background: blockColor}" style="height: 60px; margin-top: 10px;">' +
                    '<img ng-hide="blockData.fixed" class="allocation-bar-dragBar-image" src="img/bar_handler.svg"></img>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}]);
