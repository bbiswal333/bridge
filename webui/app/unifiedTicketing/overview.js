angular.module('app.unifiedticketing', ['bridge.service', 'ngTable']);

angular.module('app.unifiedticketing').directive('app.unifiedticketing', function ()
{
    var directiveController = ["$scope", "app.unifiedticketing.config", "app.unifiedticketing.ticketData", "bridgeDataService", "bridgeConfig",
        function($scope, configService, ticketDataService, bridgeDataService, bridgeConfig  ){

        $scope.box.boxSize = "2";
        $scope.ticketData = ticketDataService.getInstanceForAppId($scope.metadata.guid);
        $scope.config = configService.getConfigForAppId($scope.metadata.guid);

        if ($scope.config.isInitialized === false) {
            $scope.config.initialize($scope.appConfig);
        }
        if ($scope.ticketData.isInitialized.value === false) {
            $scope.ticketData.initialize($scope.module_name);
        }
        $scope.box.settingScreenData = {
            templatePath: "unifiedTicketing/settings.html",
            controller: function(){},
            id: $scope.boxId
        };
       $scope.box.returnConfig = function(){
            return angular.copy($scope.config);
        };

        $scope.$on('closeSettingsScreenRequested', function(event, args){
           if (args !== undefined && args.app === 'unifiedticketing'){
               $scope.ticketData.loadTicketData();
           }
        });

        $scope.prios = $scope.ticketData.prios;

        $scope.$watch('config', function (newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal){
                // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                if (oldVal !== undefined) {
                    bridgeConfig.store(bridgeDataService);
                }
            }
        },true);

        $scope.getCatClass = function(){
                $scope.catClass = Math.floor(Math.random() * 2);
            };

        $scope.getTicketCountForPrio1 = function(sPrio){
            var count = 0;
      function checkTicket(ticket){
           if(ticket.PROCESS_TYPE === "ZSER") {
                ticket.PROCESS_TYPE = "ZINC";
            }
             if(ticket.PROCESS_TYPE === "ZINE") {
                 ticket.PROCESS_TYPE = "ZINC";
             }
              if (ticket.PROCESS_TYPE === sPrio){
                    count++;
                }
             }

            if ($scope.config.bPartieOfRequestSelected === true) {
                angular.forEach($scope.ticketData.tickets.assigned_me, checkTicket);
            }
            if ($scope.config.bSavedSearchSelected === true) {
                angular.forEach($scope.ticketData.tickets.savedSearch, checkTicket);
            }
            return count;
        };
       $scope.box.reloadApp($scope.ticketData.loadTicketData, 60 * 5);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/unifiedTicketing/overview.html',
        controller: directiveController
    };
});
