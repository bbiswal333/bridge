/*
    Classes available for styling the control:
        allocation-bar-background-panel
        allocation-bar-dragger
        allocation-bar-dragger-active
        allocation-bar-block 
        allocation-bar-block-active
        allocation-bar-textfield
        allocation-bar-textfield-val
        allocation-bar-textfield-desc
        allocation-bar-container
        allocation-bar-canvas
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
            //Check whether auto-bound values are empty
            $scope.width = parseInt($scope.width || 810); //deafult width is 810px
            $scope.snapRange = parseInt($scope.snapRange || 20); //snap range of 20px is default
            $scope.padding = parseInt($scope.padding || 5);
            $scope.heigh = parseInt($scope.height || 100);

            var svg = SVG(elem[0]).size($scope.width, $scope.height).attr("class", "allocation-bar-canvas");
            var updateBySelfExpected = false;

            $scope.$watch("blocks", function() {
                if (!updateBySelfExpected) {
                    $scope.AllocationBarControl.construct($scope.blocks);
                    console.log("Rebuild");
                } else {
                    console.log("no rebuild");
                    updateBySelfExpected = false;
                }

                console.log($scope.blocks);
            }, true);

            $scope.AllocationBarControl = new AllocationBarControl(svg, 0, 0, $scope.width, $scope.height, $scope.snapRange, $scope.padding, function (blocks) {
                //$scope.$apply(function() {
                    updateBySelfExpected = false; //Strange behaviour... Two way binding isn't working properly anymore

                    $scope.blocks = blocks;
                    if (typeof $scope.onValChanged == "function") {
                        $scope.onValChanged({
                            val: blocks
                        });
                    }
                //});
            }, function (possibleValue_i) {
                $scope.onAddBtnPressed({posVal: possibleValue_i});
            }, function (removedBlock_o) {
                $scope.onBlockRemoved({removedBlock: removedBlock_o});
            });
        };

        return {
            restrict: "E",
            scope: {
                onValChanged: "&onvalchanged",
                onAddBtnPressed: "&onaddbtnpressed",
                onBlockRemoved: "&onblockremoved",
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