angular.module('bridge.box', ['bridge.service']);

angular.module('bridge.box').directive('bridge.box',
    ['$compile', '$log', '$window', '$interval', 'bridgeDataService', 'bridge.service.bridgeDownload',
    function ($compile, $log, $window, $interval, bridgeDataService, bridgeDownload) {

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

            if($window.client !== undefined)
            {
                $scope.client_update = $window.client.outdated;
            }

            $scope.box.reloadApp = function(callback_fn, reloadIntervalInSeconds) {
                if(angular.isFunction(callback_fn)) {
                    if (!angular.isNumber(reloadIntervalInSeconds)) {
                        reloadIntervalInSeconds = 60 * 5;
                    } else if (reloadIntervalInSeconds < 5) {
                        $scope.reloadIntervalInSeconds = 5;
                    } else if (reloadIntervalInSeconds > 60 * 60 * 3) {
                        reloadIntervalInSeconds = 60 * 60 * 3;
                    }
                    $scope.box.reloadIntervalPromise = $interval(callback_fn, 1000 * reloadIntervalInSeconds);
                    $scope.$on("$destroy", function(){
                        if ($scope.box.reloadIntervalPromise != null) {
                            $interval.cancel($scope.box.reloadIntervalPromise);
                        }
                    });
                }
            };

            var boxContent = $element.find("#boxContent");
            boxContent.attr("ng-if", "!(needs_client && !client)");
            var newElement = "<" + snake_case($attrs.content) + "/>";
            boxContent.append(newElement);  
            var box = $element.find("#innerbox");
            box = $compile(box)($scope);
        }
    };
}]);
