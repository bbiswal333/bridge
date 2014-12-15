angular.module('app.internalIncidents', ['notifier', 'bridge.service']);

angular.module('app.internalIncidents').directive('app.internalIncidents', function (){
    var controller = ['$scope', '$http', '$location', 'app.internalIncidents.ticketData', 'app.internalIncidents.configservice','bridgeDataService', 'bridgeConfig', 'bridge.search', 'bridge.search.fuzzySearch',
        function($scope, $http, $location, ticketDataService, configService, bridgeDataService, bridgeConfig, bridgeSearch, fuzzySearch){
            var ticketData = ticketDataService.getInstanceForAppId($scope.metadata.guid);
            var config = configService.getConfigForAppId($scope.metadata.guid);
            $scope.box.boxSize = "1";
            $scope.box.settingScreenData = {
                templatePath: "internalIncidents/settings.html",
                controller: function(){},
                id: $scope.boxId
            };
            $scope.box.returnConfig = function() {
                return config.data;
            };

            $scope.prios = ticketData.prios;
            $scope.dataInitialized = ticketData.isInitialized;
            $scope.showNoMessages = false;

            //$scope.box.errorText = "Blub";

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

            if (config.isInitialized === false){
                config.initialize($scope.appConfig);

                bridgeSearch.addSearchProvider(fuzzySearch({name: "Internal Incidents", icon: 'icon-comment', defaultSelected: true}, function() {
                        return ticketData.getRelevantTickets(config.data.selection.sel_components, config.data.selection.colleagues, config.data.selection.assigned_me, config.data.selection.created_me, config.data.ignoreAuthorAction);
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

            function setErrorText(){
                $scope.box.errorText = "<div style='width:200px'>Error loading the data from BCP. The BCP-backup system may be temporarily offline.</div>";
            }

            if (ticketData.isInitialized.value === false) {
                var initPromise = ticketData.initialize($scope.module_name);
                initPromise.then(function success() {
                    setNoMessagesFlag();
                    $scope.config = config;
                }, function error(){
                    setErrorText();
                });
            } else {
                $scope.config = config;
                setNoMessagesFlag();
                ticketData.calculateTotals();
            }

            function reloadTicketData(){
                ticketData.loadTicketData().then(function success(){
                }, function error(){
                    setErrorText();
                });
            }

            $scope.box.reloadApp(reloadTicketData, 60 * 20);
        }
    ];

    return {
        restrict: 'E',
        templateUrl: 'app/internalIncidents/overview.html',
        controller: controller
    };
});
