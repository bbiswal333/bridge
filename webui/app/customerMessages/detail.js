angular.module('app.customerMessages').controller('app.customerMessages.detailController',
    ['$scope', '$http', '$window', '$templateCache', 'app.customerMessages.ticketData','$routeParams', 'app.customerMessages.configservice', 'bridgeDataService', 'bridgeConfig', 'employeeService',
    function Controller($scope, $http, $window, $templateCache, ticketDataService, $routeParams, configService, bridgeDataService, bridgeConfig, employeeService) {
        var config = configService.getInstanceForAppId($routeParams.appId);
        var ticketData = ticketDataService.getInstanceForAppId($routeParams.appId);

        $scope.$parent.$parent.detailScreen.title = "Customer Incidents Details";
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.statusMap = {};

        function update_table()
        {
            $scope.tableData = [];
            var statusNumberMap = {};
            if($scope.messages && $scope.messages.length > 0)
            {
                if ($routeParams.calledFromNotifications === 'true'){
                    $scope.messages.forEach(function (message){
                        $scope.tableData.push(message);
                    });
                } else {
                    if (!$scope.getStatusArray().length) {
                        if ($routeParams.prio) {
                            var status_filter = $routeParams.prio.split('|');
                        }

                        $scope.prios.forEach(function (prio) {
                            if (!status_filter) {
                                $scope.statusMap[prio.name] = {"active": true};
                                return;
                            }
                            if (status_filter.indexOf(prio.name) > -1) {
                                $scope.statusMap[prio.name] = {"active": true};
                            }
                            else {
                                $scope.statusMap[prio.name] = {"active": false};
                            }
                        });
                    }

                    $scope.prios.forEach(function (prio) {
                        statusNumberMap[prio.number] = prio.name;
                    });

                    $scope.messages.forEach(function (message) {
                        message.PRIORITY_DESCR = statusNumberMap[message.PRIORITY_KEY];
                        if ($scope.statusMap[message.PRIORITY_DESCR].active) {
                            $scope.tableData.push(message);
                        }
                    });
                }
            }
        }

        $scope.$watch('statusMap', function()
        {
            update_table();
        }, true);

        $scope.userClick = function(employeeDetails){
            employeeService.showEmployeeModal(employeeDetails);
        };

        function enhanceMessage(message)
        {
            if (!message.PROCESSOR && message.PROCESSOR_ID) {
                message.PROCESSOR = message.PROCESSOR_ID;
            }

            var username = message.PROCESSOR_NAME.split(" /");
            message.PROCESSOR_NAME = username[0];

            if(message.PROCESSOR)
            {
                employeeService.getData(message.PROCESSOR).then(function(employee){
                    message.processor_enh = employee;
                });
            }
        }

        function enhanceAllMessages(){
            if ($routeParams.calledFromNotifications === 'true'){
                ticketData.ticketsFromNotifications.forEach(enhanceMessage);
            }else {
                ticketData.backendTickets.sel_components.forEach(enhanceMessage);
                ticketData.backendTickets.sel_components_aa.forEach(enhanceMessage);
                ticketData.backendTickets.colleagues.forEach(enhanceMessage);
                ticketData.backendTickets.colleagues_aa.forEach(enhanceMessage);
                ticketData.backendTickets.assigned_me.forEach(enhanceMessage);
                ticketData.backendTickets.assigned_me_aa.forEach(enhanceMessage);
            }
        }

        $scope.getStatusArray = function(){
            return Object.keys($scope.statusMap);
        };

        function addMessage(message){
            ticketData.addTicket($scope.messages, message);
        }

        $scope.$watch('config', function() {
            var ticketsToShow = {};
            if($scope.config !== undefined)
            {
                var selected_messages = [];
                $scope.messages = selected_messages;

                if ($routeParams.calledFromNotifications === 'true'){
                    angular.forEach(ticketData.ticketsFromNotifications, addMessage);
                } else {
                    ticketsToShow = ticketData.backendTickets;

                    if($scope.config.data.selection.sel_components) { angular.forEach(ticketsToShow.sel_components, addMessage); }
                    if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketsToShow.assigned_me, addMessage); }
                    if($scope.config.data.selection.colleagues)     { angular.forEach(ticketsToShow.colleagues, addMessage); }
                    if(!$scope.config.data.settings.ignore_author_action)
                    {
                        if($scope.config.data.selection.sel_components) { angular.forEach(ticketsToShow.sel_components_aa, addMessage); }
                        if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketsToShow.assigned_me_aa, addMessage); }
                        if($scope.config.data.selection.colleagues)    { angular.forEach(ticketsToShow.colleagues_aa, addMessage); }
                    }
                }

                bridgeConfig.store(bridgeDataService);
                update_table();
            }
        },true);

        function dataReady(){
            enhanceAllMessages();
        }


        if (config.isInitialized === false){
            config.initialize();
        }

        $scope.config = config;
        if (ticketData.isInitialized.value === false) {
            var promise = ticketData.initialize();

            promise.then(function success() {
                dataReady();
            });
        } else {
            dataReady();
        }
}]);
