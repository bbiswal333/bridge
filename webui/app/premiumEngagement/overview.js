angular.module("app.premiumEngagement", ["bridge.ticketAppUtils", 'notifier', 'bridge.service']);

angular.module('app.premiumEngagement').directive('app.premiumEngagement', function (){
    var overviewController = ['$scope', '$http', '$location', 'app.premiumEngagement.configService', 'app.premiumEngagement.ticketData', 'bridge.search', 'bridge.search.fuzzySearch',
        function Controller($scope, $http, $location, configService, ticketDataService, bridgeSearch, fuzzySearch) {

            var config = configService.getInstanceForAppId($scope.metadata.guid),
                ticketData = ticketDataService.getInstanceForAppId($scope.metadata.guid);

            $scope.dataInitialized = false;
            $scope.noConfiguration = false;
            $scope.box.boxSize = "1";
            $scope.box.settingScreenData = {
                templatePath: "premiumEngagement/settings.html",
                controller: function(){},
                id: $scope.boxId
            };

            $scope.box.returnConfig = function(){
                return config.data;
            };

            $scope.prios = ticketData.prios;
            $scope.aCustomerSelectionOptions = [];
            $scope.customerSelectionChanged = function(oCustomerSelection){
                config.data.sSelectedCustomer = oCustomerSelection.sId;
                ticketData.calculateTotals();
            };

            $scope.$watch("config.data.aConfiguredCustomers", function(newValue){
                if (newValue !== undefined && newValue.length === 0){
                    $scope.noConfiguration = true;
                } else {
                    $scope.noConfiguration = false;
                    $scope.aCustomerSelectionOptions = [{ sText: config.DEFAULT_CUSTOMER_SELECTION, sId: config.DEFAULT_CUSTOMER_SELECTION }];
                    config.data.aConfiguredCustomers.forEach(function(oCustomer){
                        $scope.aCustomerSelectionOptions.push({ sText: oCustomer.sId + " - " + oCustomer.sName, sId: oCustomer.sId });
                    });

                    if (_.find($scope.aCustomerSelectionOptions, { sId: config.data.sSelectedCustomer }) === undefined || config.data.sSelectedCustomer === undefined){
                        config.data.sSelectedCustomer = config.DEFAULT_CUSTOMER_SELECTION;
                    }
                }
            }, true);

            function setErrorText(){
                $scope.box.errorText = "<div style='width:200px'>Error loading the data from BCP. The BCP-backup system may be temporarily offline.</div>";
            }

            if (config.isInitialized === false) {
                config.initialize($scope.appConfig);

                bridgeSearch.addSearchProvider(fuzzySearch({name: "PE Customer Incidents", icon: 'icon-comment', defaultSelected: true}, function() {
                        return ticketData.getTicketsForCustomerSelection(config.DEFAULT_CUSTOMER_SELECTION);
                    }, {
                        keys: ["CUSTOMER", "DESCRIPTION"],
                        mappingFn: function(result) {
                            return {title: result.item.CUST_NAME, description: result.item.DESCRIPTION, score: result.score, ticket: result.item};
                        },
                        callbackFn: function(data){
                            ticketData.ticketsFromNotifications.length = 0;
                            ticketData.ticketsFromNotifications.push(data.ticket);
                            $location.path("/detail/premiumEngagement/" + $scope.metadata.guid + "/null/true");
                        }
                    }
                ));
            }

            if (ticketData.isInitialized.value === false) {
                var initPromise = ticketData.initialize($scope.module_name);
                initPromise.then(function success() {
                    $scope.config = config;
                    $scope.dataInitialized = true;
                }, function error(){
                    setErrorText();
                });
            } else {
                $scope.config = config;
                ticketData.calculateTotals();
                $scope.dataInitialized = true;
            }

            function reloadTicketData(){
                ticketData.loadTicketData().then(function success(){
                }, function error(){
                    setErrorText();
                });
            }

            $scope.box.reloadApp(reloadTicketData, 60 * 20);
        }];

    return {
        restrict: 'E',
        templateUrl: 'app/premiumEngagement/overview.html',
        controller: overviewController
    };
});
