angular.module('app.linkList', ['ui.sortable']);

angular.module('app.linkList').directive('app.linkList',
        ['app.linkList.configservice','bridgeConfig',
        function(appLinklistConfig, bridgeConfig) {

    var directiveController = ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.boxTitle = "Linklist";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;'; 
        $scope.customCSSFile = "app/linkList/style.css";

         $scope.settingScreenData = {
            templatePath: "linkList/settings.html",
                controller: angular.module('app.linkList').appLinkListSettings,
                id: $scope.boxId,
            };

            $scope.config = appLinklistConfig;

        $scope.returnConfig = function () {

                        var configCopy = angular.copy(appLinklistConfig);
                        for (var i = configCopy.linkList.length - 1; i >= 0; i--) {
                            delete configCopy.linkList[i].$$hashKey;
                            delete configCopy.linkList[i].editable;
                            delete configCopy.linkList[i].old;
                        };
                        return configCopy;
                    }; 

         var config = {};
            $scope.scrollbar = function(direction, autoResize) {
                config.direction = direction;
                config.autoResize = autoResize;
                return config;
            }
    }];
    return {
        restrict: 'E',
        templateUrl: 'app/linkList/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            var appConfig = angular.copy(bridgeConfig.getConfigForApp($scope.boxId));
            if (appConfig != undefined) {     
                    appLinklistConfig.linkList = appConfig.linkList;                  
                }
            }
    };
}]);