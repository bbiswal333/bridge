angular.module('app.incidentSavedSearch', ['notifier', 'bridge.service', 'bridge.ticketAppUtils']);

angular.module('app.incidentSavedSearch').directive('app.incidentSavedSearch', function (){
    var controller = ['$scope', '$http', '$location', 'bridgeDataService', 'bridgeConfig', 'bridge.search', 'bridge.search.fuzzySearch', '$window', 'bridge.ticketAppUtils.configUtils',
        'app.incidentSavedSearch.configservice', 'app.incidentSavedSearch.ticketData', 'app.incidentSavedSearch.savedSearchData',
        function($scope, $http, $location, bridgeDataService, bridgeConfig, bridgeSearch, fuzzySearch, $window, configUtils, configService, ticketDataService, savedSearchDataService){
            var ticketData = ticketDataService.getInstanceForAppId($scope.metadata.guid);
            var config = configService.getConfigForAppId($scope.metadata.guid);
            var savedSearchData = savedSearchDataService.getInstanceForAppId($scope.metadata.guid);

            $scope.box.boxSize = "1";
            $scope.box.settingScreenData = {
                templatePath: "incidentsBySavedSearch/settings.html",
                controller: function(){},
                id: $scope.boxId
            };

            $scope.prios = ticketData.prios;
            $scope.dataInitialized = ticketData.isInitialized;
            $scope.showNoMessages = false;

            $scope.box.headerIcons = [{
                iconCss: "fa-plus",
                title: "Create Internal Incident",
                callback: function () {
                    $window.open("https://support.wdf.sap.corp/sap/bc/dsi/ii/create_zini?sap-language=EN");
                }
            }, configUtils.goToTicketButtonConfig ];

            $scope.navigateToDetailAllTickets = function(){
                $location.path("/detail/incidentSavedSearch/" + $scope.metadata.guid + "/All/false");
            };

            function setNoMessagesFlag() {
                if (ticketData.isInitialized.value === true && !(ticketData.tickets.length > 0) ) {
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

                bridgeSearch.addSearchProvider(fuzzySearch({name: "Incident Search", icon: 'icon-comment', defaultSelected: true}, function() {
                        return ticketData.tickets;
                    }, {
                        keys: ["CATEGORY", "DESCRIPTION"],
                        mappingFn: function(result) {
                            return {title: result.item.CATEGORY, description: result.item.DESCRIPTION, score: result.score, ticket: result.item};
                        },
                        callbackFn: function(data){
                            ticketData.ticketsFromNotifications.length = 0;
                            ticketData.ticketsFromNotifications.push(data.ticket);
                            $location.path("/detail/incidentSavedSearch/" + $scope.metadata.guid + "/null/true");
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

                savedSearchData.loadData();
            } else {
                $scope.config = config;
                setNoMessagesFlag();
                ticketData.calculateTotals();
            }

            function reloadAppData(){
                ticketData.loadTicketData().then(function success(){
                }, function error(){
                    setErrorText();
                });
                savedSearchData.loadData();
            }

            $scope.box.reloadApp(reloadAppData, 60 * 10);
        }
    ];

    return {
        restrict: 'E',
        templateUrl: 'app/incidentsBySavedSearch/overview.html',
        controller: controller
    };
});
