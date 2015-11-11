angular.module('app.incidentSavedSearch').controller('app.incidentSavedSearch.detailController',
    ['$scope', '$http', '$window', 'app.incidentSavedSearch.ticketData','$routeParams', 'app.incidentSavedSearch.configservice', "bridge.converter", "bridgeDataService", "employeeService", "bridge.ticketAppUtils.detailUtils",
    function Controller($scope, $http, $window, ticketDataService, $routeParams, configService, converter, bridgeDataService, employeeService, detailUtils) {
        var config = configService.getConfigForAppId($routeParams.appId);
        var ticketData = ticketDataService.getInstanceForAppId($routeParams.appId);
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.detailForNotifications = false;

        $scope.filterTable = function(oTicket){
            return detailUtils.ticketMatches(oTicket, $scope.filterText, $scope.prios);
        };

        $scope.userClick = function(employeeDetails){
            employeeService.showEmployeeModal(employeeDetails);
        };

        function enhanceMessage(message){
            if(message.REPORTER_ID !== "") {
                employeeService.getData(message.REPORTER_ID).then(function(empData) {
                    message.reporterData = empData;
                });
            }
            if(message.PROCESSOR_ID !== "") {
                employeeService.getData(message.PROCESSOR_ID).then(function(empData) {
                    message.processorData = empData;
                });
            }
        }

        function enhanceAllMessages(){
            if ($scope.detailForNotifications === true){
                $scope.messages = ticketData.ticketsFromNotifications;
            } else {
                $scope.messages = ticketData.tickets;
            }
            $scope.messages.forEach(enhanceMessage);
        }

        $scope.$watch('config', function(newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal){
                enhanceAllMessages();
            }
        },true);

        $scope.getFormattedDate = function(sAbapDate){
            var date = converter.getDateFromAbapTimeString(sAbapDate);
            return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        };

        function setPrioSelections(active){
            angular.forEach($scope.prios, function(prio){
                prio.active = active;
            });
        }

        if (config.isInitialized === false) {
            config.initialize(bridgeDataService.getAppConfigById($routeParams.appId));
        }
        $scope.config = config;

        if ($routeParams.calledFromNotifications === "true"){
            $scope.detailForNotifications = true;
            setPrioSelections(true);
            enhanceAllMessages();
        } else {
            if (ticketData.isInitialized.value === false) {
                var promise = ticketData.initialize();

                promise.then(function success() {
                    enhanceAllMessages();
                });
            } else {
                enhanceAllMessages();
            }

            if ($routeParams.prio === 'All'){
                setPrioSelections(true);
            }else {
                setPrioSelections(false);
                _.find($scope.prios, {"key": $routeParams.prio}).active = true;
            }
        }

}]);
