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
            height: "=",
            getRemainingValue: "=",
            getBlockIndex: "=",
            blockSizeChangeRequested: "=",
            applyChangesInBlocks: "="
        },
        replace: true,
        link: function ($scope, elem) {
            var originalBlockWidth;

            // The block seems to be the task
            if (!$scope.blockData.task && $scope.blockData) {
                $scope.blockData.task = angular.copy($scope.blockData);
                $scope.blockData.fixed = true; // display of analytics
            }

            if ($scope.blockData.task.QUANTITY_DAY) { // if explicit day value is present...
                $scope.blockData.value = $scope.blockData.task.QUANTITY_DAY;
            }
            $scope.blockData.localValue = $scope.blockData.value;

            if ($scope.blockData.fixed) {
                $scope.dragBarWidth = 0;
            } else {
                $scope.dragBarWidth = 5;
            }
            $scope.blockColor = colorUtils.getColorForBlock($scope.blockData);

            $scope.getDescription = function () {
                var desc = "";
                if ($scope.blockData.desc) {
                    desc = $scope.blockData.desc;
                } else if($scope.blockData.DESCR) {
                    desc = $scope.blockData.DESCR;
                }
                if ($scope.blockData.task.ZCPR_EXTID) {
                    if (desc) { desc = desc + ",\n"; }
                    desc = desc + $scope.blockData.task.ZCPR_EXTID;
                }
                if ($scope.blockData.task.RAUFNR) {
                    if (desc) { desc = desc + ",\n"; }
                    desc = desc + $scope.blockData.task.RAUFNR;
                }
                if ($scope.blockData.task.ZCPR_OBJGEXTID) {
                    if (desc) { desc = desc + ",\n"; }
                    desc = desc + $scope.blockData.task.ZCPR_OBJGEXTID;
                }
                if ($scope.blockData.task.TASKTYPE) {
                    if (desc) { desc = desc + ",\n"; }
                    desc = desc + $scope.blockData.task.TASKTYPE;
                }
                if ($scope.blockData.task.ZZSUBTYPE) {
                    if (desc) { desc = desc + ",\n"; }
                    desc = desc + $scope.blockData.task.ZZSUBTYPE;
                }
                return desc;
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
            '<div class="allocation-bar-block" ng-style="{width: (blockData.blockWidth - dragBarWidth), background: blockColor, height: height - 20}" title="{{getDescription()}}&#013;&#010;{{getValueAsPercentage()}} % ({{getValueAbsolute()}})">' +
                '<div ng-if="height == 80" class="allocation-bar-project-text">{{blockData.desc}}</div>' +
                '<div ng-if="height == 80" class="allocation-bar-time-text">{{getValueAsPercentage()}} % ({{getValueAbsolute()}})</div>' +
            '</div>' +
            '<div class="allocation-bar-dragBar" ng-style="{width: dragBarWidth, height: height - 20}">' +
                '<div ng-style="{background: blockColor, height: height - 20}" style="margin-top: 10px;">' +
                    '<img ng-if="height == 80" ng-hide="blockData.fixed" class="allocation-bar-dragBar-image" src="img/bar_handler.svg"></img>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}]);
