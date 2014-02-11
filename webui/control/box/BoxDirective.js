angular.module('bridgeApp').directive('box', function ($compile, bridgeDataService) {

    function includeStylesheet (path_s) {
        //Check if stylesheet is already loaded
        if (document.querySelector("link[href=\"" + path_s + "\"]") == null) { 
            var elem = document.createElement("link");

            var attrHref = document.createAttribute("href");
            attrHref.nodeValue = path_s;

            var attrRel = document.createAttribute("rel");
            attrRel.nodeValue = "stylesheet";

            elem.setAttributeNode(attrHref);
            elem.setAttributeNode(attrRel);

            document.head.appendChild(elem);

            console.log("Included stylesheet " + path_s + ".");
        }
        else {
            console.log("Stylesheet " + path_s + " already loaded.")
        }
    } 

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
            //Include custom stylesheet for directive
            $scope.$watch("customCSSFile", function (val, oldVal, scope) {
                if (typeof val != "undefined") {
                    includeStylesheet($scope.customCSSFile);
                }
            });

            $element.children().children().next().append(newElement);

            if ($attrs.id) {
                bridgeDataService.boxInstances[$attrs.id].element = newElement;
            }
        }
    };
});

