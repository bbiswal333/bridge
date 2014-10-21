angular.module('app.internalIncidents', ['ngTable', 'notifier', 'bridge.service']);

angular.module('app.internalIncidents').directive('app.internalIncidents', function (){
    var controller = ['$scope', '$http', 'app.internalIncidents.ticketData', 'app.internalIncidents.configservice','bridgeDataService', 'bridgeConfig',
        function($scope, $http, ticketData, configservice, bridgeDataService, bridgeConfig){
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.data !== undefined){
                configservice.data = $scope.appConfig.data;
            }

            $scope.box.boxSize = "1";

            $scope.box.returnConfig = function() {
                return configservice;
            };

            $scope.prios = ticketData.prios;
            $scope.dataInitialized = ticketData.isInitialized;
            $scope.showNoMessages = false;

            function setNoMessagesFlag() {
                if (ticketData.isInitialized.value === true && ($scope.prios[0].total + $scope.prios[1].total + $scope.prios[2].total + $scope.prios[3].total) === 0) {
                    $scope.showNoMessages = true;
                } else {
                    $scope.showNoMessages = false;
                }
            }

            $scope.$watch('config', function (newVal, oldVal) {
                if($scope.config !== undefined && newVal !== oldVal){
                    ticketData.calculateTotals();
                    setNoMessagesFlag();
                    // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                    if (oldVal !== undefined) {
                        bridgeConfig.store(bridgeDataService);
                    }
                }
            },true);

            if (ticketData.isInitialized.value === false) {
                var initPromise = ticketData.initialize();
                initPromise.then(function success() {
                    setNoMessagesFlag();
                    $scope.config = configservice;
                });
            } else {
                $scope.config = configservice;
                setNoMessagesFlag();
                ticketData.calculateTotals();
            }

            $scope.box.reloadApp(ticketData.loadTicketData, 60 * 20);
        }
    ];

    return {
        restrict: 'E',
        templateUrl: 'app/internalIncidents/overview.html',
        controller: controller
    };
});
