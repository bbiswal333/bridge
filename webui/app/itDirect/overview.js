angular.module('app.itdirect', ['bridge.service', 'ngTable']);

angular.module('app.itdirect').directive('app.itdirect', function ()
{
    var directiveController = ["$scope", "app.itdirect.config", "app.itdirect.ticketData", "bridgeDataService", "bridgeConfig", function($scope, config, ticketData, bridgeDataService, bridgeConfig){
        if (config.isInitialized === false) {
            config.initialize($scope.appConfig);
        }
        if (ticketData.isInitialized.value === false) {
            ticketData.initialize();
        }

        $scope.box.settingScreenData = {
            templatePath: "itDirect/settings.html",
            controller: function(){},
            id: $scope.boxId
        };
        $scope.box.returnConfig = function(){
            return config;
        };

        $scope.config = config;
        $scope.prios = ticketData.prios;

        $scope.$watch('config', function (newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal){
                // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                if (oldVal !== undefined) {
                    bridgeConfig.persistInBackend(bridgeDataService);
                    // do not reload data the data if only the time of the data update changed
                    if (oldVal.lastDataUpdate !== null && oldVal.lastDataUpdate.getTime() === newVal.lastDataUpdate.getTime()) {
                        ticketData.loadTicketData();
                    }
                }
            }
        },true);

        $scope.getTicketCountForPrio = function(sPrio){
            var count = 0;

            function checkTicket(ticket){
                if (ticket.PRIORITY.toString() === sPrio){
                    count++;
                }
            }

            if (config.bPartieOfRequestSelected === true) {
                angular.forEach(ticketData.tickets.assigned_me, checkTicket);
            }
            if (config.bSavedSearchSelected === true) {
                angular.forEach(ticketData.tickets.savedSearch, checkTicket);
            }

            return count;
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/itdirect/overview.html',
        controller: directiveController
    };
});