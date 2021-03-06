﻿angular.module('app.correctionWorkbench', ['notifier']);

angular.module('app.correctionWorkbench').directive('app.correctionWorkbench', [function () {
    var directiveController = ['$scope', 'notifier', 'app.correctionWorkbench.workbenchData', 'bridgeDataService',
                                function ($scope, notifier, workbenchData, bridgeDataService)
    {
        $scope.box.boxSize = 1;

        $scope.categories = workbenchData.categories;
        $scope.showNoMessages = false;
        $scope.dataInitialized = workbenchData.isInitialized;

        bridgeDataService.getAppById($scope.metadata.guid).returnConfig = function(){
            return {
                lastDataUpdate: workbenchData.lastDataUpdate
            };
        };

        function setNoMessagesFlag() {
            if (workbenchData.isInitialized.value === true && ($scope.categories[0].total + $scope.categories[1].total + $scope.categories[2].total + $scope.categories[3].total) === 0) {
                $scope.showNoMessages = true;
            } else {
                $scope.showNoMessages = false;
            }
        }

        $scope.$watch("categories", function () {
            setNoMessagesFlag();
        }, true);


        if (workbenchData.isInitialized.value === false) {
            var initPromise = workbenchData.initialize($scope.module_name, new Date($scope.appConfig.lastDataUpdate));
            initPromise.then(function success() {
                setNoMessagesFlag();
            });
        }

        $scope.box.reloadApp(workbenchData.loadWorkbenchData, 60 * 5);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/correctionWorkbench/overview.html',
        controller: directiveController
    };
}]);
