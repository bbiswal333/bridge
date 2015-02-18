angular.module('app.customerMessages', ['notifier', 'bridge.service']);

angular.module('app.customerMessages').directive('app.customerMessages', function ()
{
    var overviewController = ['$scope', '$http', 'app.customerMessages.ticketData', 'app.customerMessages.configservice','bridgeDataService', 'bridgeConfig', 'app.customerMessages.orgUnitData',
        function Controller($scope, $http, ticketDataService, configService, bridgeDataService, bridgeConfig, orgUnitDataService) {

            var config = configService.getInstanceForAppId($scope.metadata.guid);
            var ticketData = ticketDataService.getInstanceForAppId($scope.metadata.guid);
            var orgUnitData = orgUnitDataService.getInstanceForAppId($scope.metadata.guid);

            $scope.box.boxSize = "1";
            $scope.box.settingScreenData = {
                templatePath: "customerMessages/settings.html",
                controller: angular.module('app.customerMessages').appImSettings,
                id: $scope.boxId
            };

            $scope.box.returnConfig = function(){
                return config.data;
            };

            $scope.prios = ticketData.prios;
            $scope.$parent.titleExtension = " - Customer Incidents";
            $scope.dataInitialized = ticketData.isInitialized;
            $scope.showNoMessages = false;

            function setNoMessagesFlag() {
                var totalTickets = 0;
                angular.forEach(ticketData.backendTickets, function(property){
                    totalTickets += property.length;
                });
                if (ticketData.isInitialized.value === true && totalTickets === 0) {
                    $scope.showNoMessages = true;
                } else {
                    $scope.showNoMessages = false;
                }
            }

            $scope.$watch("prios", function () {
                setNoMessagesFlag();
            }, true);


            $scope.$watch('config', function (newVal, oldVal) {
                if($scope.config !== undefined && newVal !== oldVal){
                    ticketData.updatePrioSelectionCounts();

                    // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                    if (oldVal !== undefined) {
                        bridgeConfig.store(bridgeDataService);
                    }
                }
            },true);

            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && config.isInitialized === false){
                config.initialize();
            }

            function setErrorText(text){
                var resultText = "<div style='width:200px'>";

                if (text === undefined) {
                    resultText += "Error loading the data from BCP. The BCP-backup system may be temporarily offline.";
                } else {
                    resultText += text;
                }
                resultText += "</div>";
                $scope.box.errorText = resultText;
            }

            if (ticketData.isInitialized.value === false) {
                orgUnitData.loadData();

                var initPromise = ticketData.initialize();
                initPromise.then(function success(data) {
                    setNoMessagesFlag();
                    $scope.config = config;
                    ticketData.updatePrioSelectionCounts();

                    if (data.errors !== undefined){
                        setErrorText(data.errors.BAPIRET2.MESSAGE);
                    }
                }, function error() {
                    setErrorText();
                });
            }
            else{
                $scope.config = config;
                ticketData.updatePrioSelectionCounts();
            }

            $scope.box.reloadApp(function() {
                ticketData.loadTicketData().then(function success(data){
                    if (data.errors !== undefined){
                        setErrorText(data.errors.BAPIRET2.MESSAGE);
                    }
                }, function error(){
                    setErrorText();
                });
                orgUnitData.loadData();
            }, 60 * 10);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/customerMessages/overview.html',
        controller: overviewController
    };
});
