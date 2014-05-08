angular.module("app.cats.allocationBar", ["app.cats.allocationBarBlock", "app.cats.allocationBar.utils"
]).directive("app.cats.allocationbar", [ "app.cats.allocationBar.utils.colorUtils", function (colorUtils) {

        var linkFunction = function($scope, elem) {
            $scope.width = parseInt($scope.width || 810); //deafult width is 810px
            //$scope.snapRange = parseFloat($scope.snapRange || 25); //snap range of 20px is default
            $scope.height = parseInt($scope.height || 100);

            // reset color counter that for each new allocation bar we start with the same colors for the blocks
            colorUtils.resetColorCounter();

            $scope.getRemainingValue = function () {
                var remaining = $scope.totalValue;

                for (var i = 0; i < $scope.blocks.length; i++) {
                    remaining -= $scope.blocks[i].value;
                }

                return remaining;
            };
        };

        return {
            restrict: "E",
            scope: {
                width: "@width",
                height: "@height",
                blocks: "=blocks",
                //snapRange: "@snaprange",
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
                    '<app.cats.allocationbar-block ng-repeat="block in blocks" block-data="block" total-value="totalValue" get-remaining-value="getRemainingValue" total-width="width">' +
                    '</app.cats.allocationbar-block>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}]);