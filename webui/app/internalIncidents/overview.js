angular.module('app.internalIncidents', ['notifier', 'bridge.service']);

angular.module('app.internalIncidents').directive('app.internalIncidents', function (){
    var controller = ['$scope', '$http', '$location', 'app.internalIncidents.ticketData', 'app.internalIncidents.configservice','bridgeDataService', 'bridgeConfig', 'bridge.search', 'bridge.search.fuzzySearch',
        function($scope, $http, $location, ticketData, configservice, bridgeDataService, bridgeConfig, bridgeSearch, fuzzySearch){

            $scope.box.boxSize = "1";
            $scope.box.settingScreenData = {
                templatePath: "internalIncidents/settings.html",
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

                bridgeSearch.addSearchProvider(fuzzySearch({name: "Internal Incidents", icon: 'icon-comment', defaultSelected: true}, function() {
                        return ticketData.getRelevantTickets(configservice.data.selection.sel_components, configservice.data.selection.colleagues, configservice.data.selection.assigned_me, configservice.data.selection.created_me, configservice.data.ignoreAuthorAction);
                    }, {
                        keys: ["CATEGORY", "DESCRIPTION"],
                        mappingFn: function(result) {
                            return {title: result.item.CATEGORY, description: result.item.DESCRIPTION, score: result.score, ticket: result.item};
                        },
                        callbackFn: function(data){
                            ticketData.ticketsFromNotifications.length = 0;
                            ticketData.ticketsFromNotifications.push(data.ticket);
                            $location.path("/detail/internalIncidents/null/null/true");
                        }
                    }
                ));
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
        templateUrl: 'app/internalIncidents/overview.html',
        controller: controller
    };
});
