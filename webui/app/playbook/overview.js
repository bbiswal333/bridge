angular.
  module('app.playbook', ["lib.utils"]).
  directive('app.playbook', [
    "app.playbook.configservice",
    function (tileConfigService) {
    var directiveController = ['$scope', '$http', '$window', function ($scope, $http, $window) {
        
        $scope.boxSize = "1";
        $scope.contentLoaded = false;

        $scope.searchButton_click = function () {
            $window.open('https://myplaybook.wdf.sap.corp/#/?page=search&query=' + $scope.searchString + '&map=playbook-new');
        };   

        $scope.box.settingScreenData = {
            templatePath: "playbook/settings.html",
                controller: angular.module('app.playbook').appplaybookSettings,
                id: $scope.boxId
        };

        $scope.configService = tileConfigService;

        $scope.box.returnConfig = function(){
            return angular.copy($scope.configService);
        };    

        
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/playbook/overview.html',
        controller: directiveController,
        link: function ($scope) 
             {
                if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) 
                 {
                    tileConfigService.configItem = $scope.appConfig.configItem;
                } else {
                    $scope.appConfig.configItem = tileConfigService.configItem;
                }
                $scope.box.boxSize = tileConfigService.configItem.boxSize;

                $scope.$watch("appConfig.configItem.boxSize", function () {
                    if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                        $scope.box.boxSize = $scope.appConfig.configItem.boxSize;
                    }
                    if ($scope.box.boxSize === '1'){
                        $scope.big = false;
                    }
                    if ($scope.box.boxSize === '2'){
                        $scope.big = true;
                    }
                }, true);
             }
        };
}]);
