angular.module("app.premiumEngagement", ["bridge.ticketAppUtils"]);

angular.module('app.premiumEngagement').directive('app.premiumEngagement', function (){
    var overviewController = ['$scope', '$http', 'app.premiumEngagement.configService', 'app.premiumEngagement.ticketData',
        function Controller($scope, $http, configService, ticketDataService) {

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
                return config;
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

        }];

    return {
        restrict: 'E',
        templateUrl: 'app/premiumEngagement/overview.html',
        controller: overviewController
    };
});
