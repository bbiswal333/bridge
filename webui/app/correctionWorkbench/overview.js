angular.module('app.correctionWorkbench', []);

angular.module('app.correctionWorkbench').directive('app.correctionWorkbench', [function () {
    var directiveController = ['$scope', 'notifier', 'app.correctionWorkbench.workbenchData','bridgeDataService', 'bridgeConfig',
                                function ($scope, notifier, workbenchData, bridgeDataService, bridgeConfig)
    {
        $scope.box.boxSize = 1;

        $scope.categories = workbenchData.categories;
        $scope.showNoMessages = false;
        $scope.dataInitialized = workbenchData.isInitialized;

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
            var initPromise = workbenchData.initialize();
            initPromise.then(function success() {
                setNoMessagesFlag();
            });
        }
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/correctionWorkbench/overview.html',
        controller: directiveController
    };
}]);