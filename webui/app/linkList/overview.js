angular.module('app.linkList', []);

angular.module('app.linkList').directive('app.linkList',
        ['app.linkList.configservice','bridgeConfig', 
        function(appLinklistConfig, bridgeConfig) {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Linklist";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;'; 

         $scope.settingScreenData = {
            templatePath: "linkList/settings.html",
                controller: angular.module('app.linkList').appLinkListSettings,
                id: $scope.boxId,
            };

            $scope.config = appLinklistConfig;
        /*
         $scope.$watch('appLinklistConfig.linkList', function() {
                $scope.links = appLinklistConfig.linkList;  
            },true);*/

        $scope.returnConfig = function () {
                        console.log("return");
                        console.log(appLinklistConfig);
                        return appLinklistConfig;
                    };
            
    }];
    return {
        restrict: 'E',
        templateUrl: 'app/linkList/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            var appConfig = angular.copy(bridgeConfig.getConfigForApp($scope.boxId));
            
            if (appConfig != undefined) {
            console.log(appConfig);      
                    appLinklistConfig.linkList = appConfig.linkList;
                }
            }
    };
}]);