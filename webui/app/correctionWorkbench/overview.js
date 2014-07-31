angular.module('app.correctionWorkbench', []);

angular.module('app.correctionWorkbench').factory("app.correctionWorkbench.configservice", function () 
{  
    //set the default configuration object
    var config = {};
    config.data = {};
    config.data.settings = {};
    config.data.selection = {};
    config.data.selection.correctionRequestsForTesting = true;
    config.data.selection.correctiveMeasures = false;
    return config;
});

angular.module('app.correctionWorkbench').directive('app.correctionWorkbench', ['app.correctionWorkbench.configservice', function (configservice) {
    var directiveController = ['$scope', 'notifier', 'app.correctionWorkbench.workbenchData','bridgeDataService', 'bridgeConfig',
                                function ($scope, notifier, workbenchData, bridgeDataService, bridgeConfig)
    {
        $scope.box.boxSize = 1;

        $scope.prios = workbenchData.prios;
        $scope.showNoMessages = false;
        $scope.dataInitialized = workbenchData.isInitialized;

        function setNoMessagesFlag() {
            if (workbenchData.isInitialized.value === true && ($scope.prios[0].total + $scope.prios[1].total + $scope.prios[2].total + $scope.prios[3].total) === 0) {
                $scope.showNoMessages = true;
            } else {
                $scope.showNoMessages = false;
            }
        }

        $scope.box.returnConfig = function()
        {
            return configservice;
        };

        $scope.$watch("prios", function () {
            setNoMessagesFlag();
        }, true);

        $scope.$watch('config', function (newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal)
            {
                workbenchData.updatePrioSelectionCounts();
                
                // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                if (oldVal !== undefined) {
                    bridgeConfig.persistInBackend(bridgeDataService);
                }
            }
        },true); 

        if (workbenchData.isInitialized.value === false) {
            var initPromise = workbenchData.initialize();
            initPromise.then(function success() {
                setNoMessagesFlag();
            });
        }

        $scope.config = configservice;
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/correctionWorkbench/overview.html',
        controller: directiveController,
        link: function ($scope) 
        {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.data !== undefined) 
            {
                configservice.data = $scope.appConfig.data;
            }            
        }
    };
}]);