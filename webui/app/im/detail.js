angular.module('app.im').controller('app.im.detailController', ['$scope', '$http','$templateCache', 'app.im.ticketData','$routeParams',  function Controller($scope, $http, $templateCache, ticketData, $routeParams) {

        $scope.$parent.titleExtension = " - IM Details";   
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.statusMap = {};  


        $scope.$watch('messages', function () 
        {                        
            update_table();            
        }, true);

        $scope.$watch('statusMap', function()
        {
            update_table();
        }, true);

        function update_table()
        {
            if($scope.messages && $scope.messages.length > 0)
            {
                if(!$scope.getStatusArray().length)
                {
                    var status_filter = $routeParams['prio'].split('|'); 

                    $scope.prios.forEach(function (prio){
                        if(status_filter.indexOf(prio.name) > -1)
                            $scope.statusMap[prio.name] = {"active":true};
                        else
                            $scope.statusMap[prio.name] = {"active":false};
                    })
                }
                $scope.tableData = [];

                $scope.messages.forEach(function (message){
                    if ($scope.statusMap[message.PRIOSTXT].active) {
                        $scope.tableData.push(message);
                    };
                })                                
            }                      
        }

        function enhanceMessage(message) {
            $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + message.SUSID + '&origin=' + location.origin).then(function (response) {
                message.employee = response.data.DATA;
                message.employee.TELNR = message.employee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                message.url = 'https://people.wdf.sap.corp/profiles/' + message.SUSID;
                message.ticket_url = 'https://gtpmain.wdf.sap.corp:443/sap/bc/webdynpro/qce/msg_gui_edit?csinsta=' + message.CSINSTA + '&mnumm=' + message.MNUMM + '&myear=' + message.MYEAR + '&sap-language=en#';
                message.username = message.employee.VORNA + ' ' + message.employee.NACHN;
                message.mail = message.employee.SMTP_MAIL;
                message.tel = message.employee.TELNR;
                $scope.messages.push(message);
            });
        }

        function enhanceAllMessages() {
            if (angular.isArray(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                angular.forEach(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (message) {
                    enhanceMessage(message);
                });
            } else {
                enhanceMessage(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT);
            }
        }

        $scope.getStatusArray = function(){
            return Object.keys($scope.statusMap);
        }

        if (ticketData.isInitialized.value === false) {
            var promise = ticketData.initialize();

            promise.then(function success(data) {
                enhanceAllMessages();
            });
        } else {
            enhanceAllMessages();
        }
}]);


