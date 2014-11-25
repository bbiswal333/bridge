angular.module('app.internalIncidentsTest').controller('app.internalIncidentsTest.detailController',
    ['$scope', '$http', '$window', 'app.internalIncidentsTest.ticketData','$routeParams', 'app.internalIncidentsTest.configservice', "bridge.converter", "bridgeDataService",
    function Controller($scope, $http, $window, ticketData, $routeParams, config, converter, bridgeDataService) {
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.detailForNotifications = false;

        $scope.filterTable = function(oTicket){
            var bTicketPriorityMatches = false;
            angular.forEach($scope.prios, function(prio){
                if (prio.active === true && oTicket.PRIORITY_KEY === prio.key){
                    bTicketPriorityMatches = true;
                }
            });

            var bTicketContainsFilterString = false;
            if ($scope.filterText === "" || $scope.filterText === undefined){
                bTicketContainsFilterString = true;
            } else {
                var property;
                for (property in oTicket){
                    if (oTicket[property].toString().toUpperCase().indexOf($scope.filterText.toUpperCase()) !== -1){
                        bTicketContainsFilterString = true;
                    }
                }
            }

            return bTicketPriorityMatches && bTicketContainsFilterString;
        };

        function enhanceMessage(message){
            if(message.REPORTER_ID !== "")
            {
                $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + message.REPORTER_ID + '&origin=' + $window.location.origin).then(function (response) {
                    message.employee = response.data.DATA;
                    if(message.employee.BNAME !== ""){
                        message.employee.TELNR = message.employee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                        message.url = 'https://people.wdf.sap.corp/profiles/' + message.employee.BNAME;
                        message.username = message.employee.VORNA + ' ' + message.employee.NACHN;
                        message.mail = message.employee.SMTP_MAIL;
                        message.tel = message.employee.TELNR;
                    }
                });
            }
        }

        function enhanceAllMessages(){
            if ($scope.detailForNotifications === true){
                $scope.messages = ticketData.ticketsFromNotifications;
            } else {
                $scope.messages = ticketData.getRelevantTickets(config.data.selection.sel_components, config.data.selection.colleagues, config.data.selection.assigned_me, config.data.selection.created_me, config.data.ignoreAuthorAction);
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

            setPrioSelections(false);
            _.find($scope.prios, {"key": $routeParams.prio}).active = true;
        }

}]);