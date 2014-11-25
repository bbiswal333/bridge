angular.module('app.internalIncidentsTest', ['notifier', 'bridge.service']);

angular.module('app.internalIncidentsTest').directive('app.internalIncidentsTest', function (){
    var controller = ['$scope', '$http', '$location', 'app.internalIncidentsTest.ticketData', 'app.internalIncidentsTest.configservice','bridgeDataService', 'bridgeConfig',
        function($scope, $http, $location, ticketData, configservice, bridgeDataService, bridgeConfig){

            $scope.box.boxSize = "1";
            $scope.box.settingScreenData = {
                templatePath: "internalIncidentsTest/settings.html",
                controller: function(){},
                id: $scope.boxId
            };
            $scope.box.returnConfig = function() {
                return configservice.data;
            };

            $scope.prios = ticketData.prios;
            $scope.dataInitialized = ticketData.isInitialized;
            $scope.showNoMessages = false;

            function setNoMessagesFlag() {
                if (ticketData.isInitialized.value === true && ticketData.tickets.RESULTNODE1 === "" && ticketData.tickets.RESULTNODE2 === "" && ticketData.tickets.RESULTNODE3 === "") {
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

            if (configservice.isInitialized === false){
                configservice.initialize($scope.appConfig);
            }

            if (ticketData.isInitialized.value === false) {
                var initPromise = ticketData.initialize($scope.module_name);
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
        templateUrl: 'app/internalIncidentsTest/overview.html',
        controller: controller
    };
});