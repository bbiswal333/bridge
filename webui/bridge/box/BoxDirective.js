﻿angular.module('bridge.box', ['bridge.service']);

angular.module('bridge.box').directive('bridge.box', ['$compile', '$log', 'bridgeDataService', 'bridge.service.bridgeDownload', function ($compile, $log, bridgeDataService, bridgeDownload) {

    function directiveController($scope)
    {        
        $scope.show_download = bridgeDownload.show_download;                    
    }

    function snake_case(name){
        var separator = '-';
        return name.replace(/[A-Z]/g, function(letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }     

    return {
        restrict: 'E',
        templateUrl: 'bridge/box/BoxDirective.html',
        directiveController: directiveController,
        scope: true,
        link: function ($scope, $element, $attrs) {
            $scope.box = {};
            if ($attrs.id) {
                //get app metadata and app config
                var metadata = bridgeDataService.getAppById($attrs.id).metadata;
                for (var attribute in metadata) {
                    if (metadata.hasOwnProperty(attribute)) 
                    {
                        $scope[attribute] = metadata[attribute];
                    }
                }                
                $scope.appConfig = bridgeDataService.getAppConfigById($attrs.id);
                $scope.box.needs_client = $scope.needs_client;                

                if (!bridgeDataService.getAppById($attrs.id).scope) 
                {                    
                    bridgeDataService.getAppById($attrs.id).scope = $scope;
                }
            }
            else {
                $log.error("Box has no id!");
            }            
                
            var boxContent = $element.find("#boxContent");
            boxContent.attr("ng-if", "!(needs_client && !client)");
            var newElement = "<" + snake_case($attrs.content) + "/>";
            boxContent.append(newElement);  
            var box = $element.find("#innerbox");
            box = $compile(box)($scope);
        }
    };
}]);

