angular.module('app.internalIncidents').controller('app.internalIncidents.detailController',
    ['$scope', '$http', '$window', 'app.internalIncidents.ticketData','$routeParams', 'app.internalIncidents.configservice', 'bridgeDataService', "bridge.converter",
    function Controller($scope, $http, $window, ticketData, $routeParams, config, bridgeDataService, converter) {
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
            $scope.messages = ticketData.getRelevantTickets();

            $scope.messages.forEach(enhanceMessage);
        }

        $scope.$watch('config', function() {
            if($scope.config !== undefined){
                enhanceAllMessages();
            }
        },true);

        $scope.getFormattedDate = function(sAbapDate){
            return converter.getDateFromAbapTimeString(sAbapDate).toLocaleString();
        };

        function resetPrioSelections(){
            angular.forEach($scope.prios, function(prio){
                prio.active = false;
            });
        }

        if (ticketData.isInitialized.value === false) {
            var promise = ticketData.initialize();

            promise.then(function success() {
                enhanceAllMessages();
                $scope.config = config;
            });
        } else {
            enhanceAllMessages();
            $scope.config = config;
        }

        resetPrioSelections();
        _.find($scope.prios, {"key": $routeParams.prio}).active = true;
}]);
