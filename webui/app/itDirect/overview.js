angular.module('app.itdirect', ['bridge.service', 'ngTable']);

angular.module('app.itdirect').directive('app.itdirect', function ()
{
    var directiveController = ["$scope", "app.itdirect.config", "app.itdirect.ticketData", "bridgeDataService", "bridgeConfig", "$window",
    function($scope, config, ticketData, bridgeDataService, bridgeConfig, $window){
        if (config.isInitialized === false) {
            config.initialize($scope.appConfig);
        }
        if (ticketData.isInitialized.value === false) {
            ticketData.initialize($scope.module_name);
        }

        $scope.box.settingScreenData = {
            templatePath: "itDirect/settings.html",
            controller: function(){},
            id: $scope.boxId
        };
        $scope.box.headerIcons = [{
            iconCss: "fa-plus",
            title: "Create Ticket",
            callback: function(){
                $window.alert("test");
            }
        }];
        $scope.box.returnConfig = function(){
            return config;
        };

        $scope.$on('closeSettingsScreenRequested', function(event, args){
           if (args !== undefined && args.app === 'itdirect'){
               ticketData.loadTicketData();
           }
        });

        $scope.config = config;
        $scope.prios = ticketData.prios;

        $scope.$watch('config', function (newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal){
                // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                if (oldVal !== undefined) {
                    bridgeConfig.store(bridgeDataService);
                }
            }
        },true);

        $scope.getTicketCountForPrio = function(sPrio){
            var count = 0;

            function checkTicket(ticket){
                if (ticket.URGENCY.toString() === sPrio){
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

        $scope.box.reloadApp(ticketData.loadTicketData, 60 * 5);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/itDirect/overview.html',
        controller: directiveController
    };
});
