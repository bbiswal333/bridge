angular.module('app.internalIncidents', ['notifier', 'bridge.service', 'bridge.ticketAppUtils']);

angular.module('app.internalIncidents').directive('app.internalIncidents', function (){
    var controller = ['$scope', '$http', '$location', 'app.internalIncidents.bcpTicketData', 'app.internalIncidents.mitosisTicketData', 'app.internalIncidents.configservice','bridgeDataService', 'bridgeConfig', 'bridge.search', 'bridge.search.fuzzySearch', '$window', 'bridge.ticketAppUtils.configUtils',
        function($scope, $http, $location, bcpTicketDataService, mitosisTicketDataService, configService, bridgeDataService, bridgeConfig, bridgeSearch, fuzzySearch, $window, configUtils){
            var ticketData;
            var config = configService.getConfigForAppId($scope.metadata.guid);
            $scope.config = config;

            $scope.box.boxSize = "1";
            $scope.box.settingScreenData = {
                templatePath: "internalIncidents/settings.html",
                controller: function(){},
                id: $scope.boxId
            };
            $scope.box.returnConfig = function() {
                return config.data;
            };

            $scope.showNoMessages = false;

            $scope.box.headerIcons = [{
                iconCss: "fa-plus",
                title: "Create Ticket",
                callback: function () {
                    $window.open("https://support.wdf.sap.corp/sap/bc/dsi/ii/create_zini?sap-language=EN");
                }
            }, configUtils.goToTicketButtonConfig ];

            function setNoMessagesFlag() {
                if(!config.data.advancedMode) {
                    if (ticketData.isInitialized.value === true && ticketData.tickets.RESULTNODE1 === "" && ticketData.tickets.RESULTNODE2 === "" && ticketData.tickets.RESULTNODE3 === "") {
                        $scope.showNoMessages = true;
                    } else {
                        $scope.showNoMessages = false;
                    }
                }
            }

            function setErrorText(){
                $scope.box.errorText = "<div style='width:200px'>Error loading the data from BCP. The BCP-backup system may be temporarily offline.</div>";
            }

            function initializeTicketData() {
                if(config.data.advancedMode === true) {
                    ticketData = mitosisTicketDataService.getInstanceForAppId($scope.metadata.guid);
                } else {
                    ticketData = bcpTicketDataService.getInstanceForAppId($scope.metadata.guid);
                }

                $scope.prios = ticketData.prios;
                $scope.dataInitialized = ticketData.isInitialized;

                if (ticketData.isInitialized.value === false) {
                    var initPromise = ticketData.initialize($scope.module_name);
                    $scope.loadingTicketsPromise = initPromise;
                    initPromise.then(function success() {
                        setNoMessagesFlag();
                    }, function error(){
                        setErrorText();
                    });
                } else {
                    setNoMessagesFlag();
                    ticketData.calculateTotals();
                }

                function reloadTicketData(){
                    $scope.loadingTicketsPromise = ticketData.loadTicketData().then(function success(){
                    }, function error(){
                        setErrorText();
                    });
                }

                $scope.box.reloadApp(reloadTicketData, 60 * 20);

            }

            $scope.$watch('config', function (newVal, oldVal) {
                if($scope.config !== undefined && newVal !== oldVal && oldVal && newVal.data.isInitialized === oldVal.data.isInitialized){
                    if($scope.config.data.advancedMode && ticketData.isInitialized.value === true) {
                        $scope.loadingTicketsPromise = ticketData.loadTicketData();
                    } else {
                        ticketData.calculateTotals();
                        setNoMessagesFlag();
                    }
                    // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                    if (oldVal !== undefined) {
                        bridgeConfig.store(bridgeDataService);
                    }
                } if(oldVal && newVal.data.advancedMode !== oldVal.data.advancedMode) {
                    initializeTicketData();
                }
            }, true);

            if (config.isInitialized === false){
                config.initialize($scope.appConfig);

                initializeTicketData();

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
            } else {
                initializeTicketData();
            }
        }
    ];

    return {
        restrict: 'E',
        templateUrl: 'app/internalIncidents/overview.html',
        controller: controller
    };
});
