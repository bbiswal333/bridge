angular.module('app.customerMessages', []);

angular.module('app.customerMessages').factory("app.customerMessages.configservice", function (){
    //set the default configuration object
    var config = {};
    config.data = {};
    config.data.settings = {};
    config.data.settings.ignore_author_action = true;
    config.data.settings.filterByOrgUnit = false;
    config.data.settings.selectedOrgUnits = [];
    config.data.settings.notificationDuration = 5000;
    config.data.selection = {};
    config.data.selection.sel_components = true;
    config.data.selection.assigned_me = false;
    config.data.selection.colleagues = false;
    config.lastDataUpdate = null;

    return config;
});

angular.module('app.customerMessages').directive('app.customerMessages', function ()
{
    return {
        restrict: 'E',
        templateUrl: 'app/customerMessages/overview.html'
    };
});

angular.module('app.customerMessages').controller('app.customerMessages.directiveController',
    ['$scope', '$http', 'app.customerMessages.ticketData', 'app.customerMessages.configservice','bridgeDataService', 'bridgeConfig', 'app.customerMessages.orgUnitData',
    function Controller($scope, $http, ticketData, configservice, bridgeDataService, bridgeConfig, orgUnitData) {

        $scope.box.boxSize = "1";
        $scope.box.settingScreenData = {
            templatePath: "customerMessages/settings.html",
            controller: angular.module('app.customerMessages').appImSettings,
            id: $scope.boxId
        };

        $scope.box.returnConfig = function(){
            return configservice;
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

        if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.data !== undefined){
            configservice.data = $scope.appConfig.data;
            configservice.lastDataUpdate = new Date($scope.appConfig.lastDataUpdate);
        }

        if (ticketData.isInitialized.value === false) {
            orgUnitData.loadData();

            var initPromise = ticketData.initialize();
            initPromise.then(function success() {
                setNoMessagesFlag();
                $scope.config = configservice;
                ticketData.updatePrioSelectionCounts();
            });
        }
        else{
            $scope.config = configservice;
            ticketData.updatePrioSelectionCounts();
        }

        $scope.box.reloadApp(function() {
            ticketData.loadTicketData();
            orgUnitData.loadData();
        }, 60 * 10);
}]);
