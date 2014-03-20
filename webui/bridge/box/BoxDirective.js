﻿angular.module('bridge.box', ['bridge.service']);

angular.module('bridge.box').directive('bridge.box', ['$compile', 'bridgeDataService', 'bridge.service.bridgeDownload', '$http', function ($compile, bridgeDataService, bridgeDownload, $http) {

    function directiveController($scope)
    {
        $scope.show_download = bridgeDownloadService.show_download;
    }

    function needsClient(boxNeedsClient, $scope, $element)
    {
        $scope.clientNeeded = boxNeedsClient;
        
        $http.get('http://localhost:8000/client').success(function (data, status) {
            $scope.client = true;
        }).error(function (data, status, header, config) { 
            $scope.client = false;     
        });

        $scope.clientNeeded = boxNeedsClient && !$scope.client;    

        if($scope.clientNeeded)
        {
            $scope.boxClass = "boxDisable";
            $element.children().children().next().remove();
        }
        else
        {
            $scope.boxClass = "";
            //$element.children().children().next().remove();
        }
    }

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
        templateUrl: 'bridge/box/BoxDirective.html',
        directiveController: directiveController,
        scope: true,
        link: function ($scope, $element, $attrs, $modelCtrl) {

            if ($attrs.id) {
                $scope.boxId = $attrs.id;
                $scope.size = $attrs.size;

                if (!bridgeDataService.boxInstances[$attrs.id]) {
                    bridgeDataService.boxInstances[$attrs.id] = {
                        scope: $scope,
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

            $scope.$watch("boxNeedsClient", function(val, oldVal, scope) {
                if (typeof val != "undefined") {
                    needsClient(val, $scope, $element);
                }  
            });

            if ($attrs.id) {
                bridgeDataService.boxInstances[$attrs.id].element = newElement;
            }
        }
    };
}]);

