angular.module("app.cats.allocationBar", ["app.cats.allocationBarBlock", "app.cats.allocationBar.utils"
]).directive("app.cats.allocationbar", [ "app.cats.allocationBar.utils.colorUtils", "app.cats.allocationBar.utils.blockCalculations", function (colorUtils, blockCalculations) {

        var linkFunction = function($scope, elem) {
            $scope.width = parseInt($scope.width || 810); //deafult width is 810px
            $scope.height = parseInt($scope.height || 100);

            // reset color counter that for each new allocation bar we start with the same colors for the blocks
            colorUtils.resetColorCounter();

            $scope.getRemainingValue = function () {
                var remaining = $scope.totalValue;
                for (var i = 0; i < $scope.blocks.length; i++) {
                    remaining -= $scope.blocks[i].value; // value is not modified during dragging
                }
                return Math.round(remaining * 1000) / 1000;
            };

            $scope.getBlockIndex = function(block) {
                return $scope.blocks.indexOf(block);
            }

            $scope.blockSizeChangeRequested = function(block, uiPositionLeft, originalBlockWidth){
                var changeValue = block.localValue;
                var changeWidth = block.blockWidth;
                var nextBlock = $scope.getNext(block);
                var remainingValue = $scope.getRemainingValue();

                // initialize localValue
                if(nextBlock && !nextBlock.localValue) {
                    nextBlock.localValue = nextBlock.value;
                }

                if(nextBlock) {
                    remainingValue += nextBlock.value - 0.01;
                }

                var blockMetrics =
                    blockCalculations.calculateBlockMetrics(
                        uiPositionLeft,
                        originalBlockWidth,
                        $scope.width,
                        block.value,
                        remainingValue,
                        $scope.totalValue,
                        block.fixed
                    );

                block.blockWidth = Math.round(blockMetrics.newWidth * 1000) / 1000;
                block.localValue = Math.round(blockMetrics.newValue * 1000) / 1000;

                if(!nextBlock)
                    return;

                changeValue = Math.round((blockMetrics.newValue - changeValue) * 1000) / 1000;
                changeWidth = Math.round((blockMetrics.newWidth - changeWidth) * 1000) / 1000;
                if(nextBlock.localValue - changeValue >= 0.01 ) {
                    nextBlock.localValue = Math.round((nextBlock.localValue - changeValue) * 1000) / 1000;
                    nextBlock.blockWidth = Math.round((nextBlock.blockWidth - changeWidth) * 1000) / 1000;
                }

                if(!$scope.areChangesCorrect()) {
                    nextBlock.localValue = Math.round((0.01) * 1000) / 1000;
                    nextBlock.blockWidth = Math.round((nextBlock.blockWidth - changeWidth) * 1000) / 1000;
                }
            }

            $scope.areChangesCorrect = function(){
                var sumOffValuesAfterChange = 0;
                $scope.blocks.forEach(function(block){
                    if(block.localValue) {
                        if(block.localValue <= 0.01) {
                            block.localValue = 0.01;
                            block.blockWidth = blockCalculations.getWidthFromValue(block.localValue, $scope.width, $scope.totalValue);
                        }
                        sumOffValuesAfterChange += Math.round(block.localValue * 1000) / 1000;
                    } else {
                        sumOffValuesAfterChange += Math.round(block.value * 1000) / 1000;
                    }
                });
                sumOffValuesAfterChange = Math.round(sumOffValuesAfterChange * 1000) / 1000;
                if(sumOffValuesAfterChange > 1)
                    return false;
                else
                    return true;
            }

            $scope.applyChangesInBlocks = function(){
                $scope.blocks.forEach(function(block){
                    block.value = block.localValue;
                })
            }

            $scope.hasNext = function(block) {
                return $scope.getBlockIndex(block)+1 != $scope.blocks.length
            }

            $scope.getNext = function(block) {
                if($scope.hasNext(block)) {
                    return $scope.blocks[$scope.getBlockIndex(block)+1];
                }
                return null;
            }
        };

        return {
            restrict: "E",
            scope: {
                width: "@width",
                height: "@height",
                blocks: "=blocks",
                totalValue: "@totalValue",
            },
            replace: true,
            link: linkFunction,
            templateUrl: "allocationBarDirective.tmpl.html"
        };
    }
]).run(["$templateCache", function ($templateCache) {
    $templateCache.put("allocationBarDirective.tmpl.html",
        '<div class="allocation-bar-container">' +
            '<div class="allocation-bar-background-panel" style="padding-top: 10px" ng-style="{width: width, height: height}">' +
                '<div class="allocation-bar-background-panel-div" style="height:60px">' +
                    '<font ng-if="!blocks.length" class="allocation-bar-background-panel-hint">Please select date(s) and choose tasks from the list on the left</font>' +
                    '<app.cats.allocationbar-block ng-repeat="block in blocks" block-data="block" total-value="totalValue" get-remaining-value="getRemainingValue" get-block-index="getBlockIndex" block-size-change-requested="blockSizeChangeRequested" apply-changes-in-blocks="applyChangesInBlocks" total-width="width">' +
                    '</app.cats.allocationbar-block>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}]);