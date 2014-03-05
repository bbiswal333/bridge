angular.module("app.cats.allocationbar", [
    "app.cats.allocationbar.utils",
    "app.cats.allocationbar.core.control"
]).directive("app.cats.allocationbar", [
    "app.cats.allocationbar.utils.colorUtils",
    "app.cats.allocationbar.core.control",
    function(colorUtils, AllocationBarControl) {
        var linkFunction = function($scope, elem) {
            //Check whether auto-bound values are empty
            $scope.width = parseInt($scope.width || 810); //deafult width is 810px
            $scope.snapRange = parseInt($scope.snapRange || 20); //snap range of 20px is default
            $scope.padding = parseInt($scope.padding || 5);
            $scope.heigh = parseInt($scope.height || 100);

            var updateBySelfExpected = false;

            $scope.$watch("blocks", function() {
                if (!updateBySelfExpected) {
                    $scope.AllocationBarControl.construct($scope.blocks);
                } else {
                    updateBySelfExpected = false;
                }
            }, true);

            $scope.AllocationBarControl = new AllocationBarControl(SVG(elem[0]).size($scope.width, $scope.height), 0, 0, $scope.width, $scope.height, "#DDDDDD", $scope.snapRange, $scope.padding, function(blocks) {
                $scope.$apply(function() {
                    updateBySelfExpected = true;

                    $scope.blocks = blocks;
                    if (typeof $scope.onValChanged == "function") {
                        $scope.onValChanged({
                            val: blocks
                        });
                    }
                });
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
]).controller("myController", function($scope) {
    $scope.blockdata = [{
        desc: "Project A",
        value: 50
    }, {
        desc: "Project B",
        value: 25
    }, {
        desc: "Project X",
        value: 25
    }];

    $scope.addBlock = function() {
        $scope.blockdata.push({
            desc: "Project Blah!",
            value: 10
        });
    }

    $scope.myCallback = function(val) {
        $scope.value = val;
        console.log(val);
    };
});
