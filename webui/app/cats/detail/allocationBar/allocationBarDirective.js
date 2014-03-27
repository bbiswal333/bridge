/*
    Classes available for styling the control:
        allocation-bar-background-panel
        allocation-bar-dragger
        allocation-bar-dragger-active
        allocation-bar-block 
        allocation-bar-block-div
        allocation-bar-block-name-div
        allocation-bar-block-value-div
        allocation-bar-block-active
        allocation-bar-textfield
        allocation-bar-textfield-val
        allocation-bar-textfield-desc
        allocation-bar-container
        allocation-bar-canvas
        allocation-bar-block-bin-div
        allocation-bar-block-bin
    Please note, that not all CSS styles known from stlying HTML-elements are applicable on SVG-elements (e. g. width, height, ...)
*/

angular.module("app.cats.allocationBar", [
    "app.cats.allocationBar.utils",
    "app.cats.allocationBar.core.control"
]).directive("app.cats.allocationbar", [ //allocationbar is here not written in camel case -this has to be that way!
    "app.cats.allocationBar.utils.colorUtils",
    "app.cats.allocationBar.core.control",
    function(colorUtils, AllocationBarControl) {
        var linkFunction = function($scope, elem) {
            var allocBarCntrl;

            //Check whether auto-bound values are empty
            $scope.width = parseInt($scope.width || 810); //deafult width is 810px
            console.log("Received SnapRange: " + $scope.snapRange);
            $scope.snapRange = parseFloat($scope.snapRange || 25); //snap range of 20px is default
            $scope.padding = parseInt($scope.padding || 5);
            $scope.height = parseInt($scope.height || 100);

            var svg = SVG(elem[0]).size($scope.width, $scope.height).attr("class", "allocation-bar-canvas");
            var updateBySelfExpected = false;

            $scope.$watch("blocks", function() {
                allocBarCntrl.construct($scope.blocks);
            }, true);

            console.log("SR Initial: " + $scope.snapRange);

            allocBarCntrl = new AllocationBarControl(svg, 0, 0, $scope.width, $scope.height, $scope.snapRange, $scope.padding, function (blocks) {
                $scope.$apply(function () {
                    //Copy changes from one array to the other ==> assigning them would destroy two-way-binding
                    $scope.blocks.length = 0;
                    for (var i = 0; i < blocks.length; i++) {
                        $scope.blocks.push(blocks[i]);
                    }
                });
            }, function (removedBlock_o) {
                $scope.onBlockRemoved({removedBlock: removedBlock_o});
            }, function (perc_f) {
                if (typeof $scope.handlerValueToDisplay == "function") {
                    return $scope.handlerValueToDisplay({perc: perc_f});
                }
                return Math.floor(perc_f * 100) / 100 + " %"; //Rounding on 2 digíts after decimal separator
            });
        };

        return {
            restrict: "E",
            scope: {
                onBlockRemoved: "&onblockremoved",
                handlerValueToDisplay: "&handlervaluetodisplay",
                width: "@width",
                height: "@height",
                blocks: "=blocks",
                snapRange: "@snaprange",
                padding: "@padding"
            },
            replace: true,
            link: linkFunction,
            templateUrl: "allocationBarDirective.tmpl.html"
        };
    }
]).run(["$templateCache", function ($templateCache) {
    //Load template into template Cache
    $templateCache.put("allocationBarDirective.tmpl.html", '<div class="allocation-bar-container"></div>');
}]);