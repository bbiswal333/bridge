angular.module('app.links', []);

angular.module('app.links').directive('app.links',['app.links.linkData','bridgeConfig', function (linkData,bridgeConfig) {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Linklist";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;'; 

         $scope.settingScreenData = {
            templatePath: "links/settings.html",
                controller: angular.module('app.links').appLinksSettings,
                id: $scope.boxId,
            };

        $scope.links = linkData;   
    }];
    return {
        restrict: 'E',
        templateUrl: 'app/links/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            var currentConfigItem;
            var appConfig = angular.copy(bridgeConfig.getConfigForApp($scope.boxId));

            if (appConfig != undefined) {

                    linkData = appConfig;

                }
            }
    };
}]);