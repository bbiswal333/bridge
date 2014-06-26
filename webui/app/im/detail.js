angular.module('app.im').controller('app.im.detailController', ['$scope', '$http','$templateCache', 'app.im.ticketData','$routeParams', 'app.im.configservice', 'bridgeDataService', 'bridgeConfig', function Controller($scope, $http, $templateCache, ticketData, $routeParams, configservice, bridgeDataService, bridgeConfig) {

        $scope.$parent.titleExtension = " - IM Details";   
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.statusMap = {};  
        $scope.zoomIndex = -1;
        $scope.zoomImg = null;


        function update_table()
        {
            $scope.tableData = [];
            if($scope.messages && $scope.messages.length > 0)
            {
                if(!$scope.getStatusArray().length)
                {
                    var status_filter = $routeParams.prio.split('|'); 

                    $scope.prios.forEach(function (prio){
                        if(status_filter.indexOf(prio.name) > -1)
                        {
                            $scope.statusMap[prio.name] = {"active":true};
                        }
                        else
                        {
                            $scope.statusMap[prio.name] = {"active":false};
                        }
                    });
                }                
                $scope.messages.forEach(function (message){
                    if ($scope.statusMap[message.PRIOSTXT].active) {
                        $scope.tableData.push(message);
                    }
                });                               
            }                      
        }

        $scope.$watch('messages', function () 
        {                        
            update_table();            
        }, true);

        $scope.$watch('statusMap', function()
        {
            update_table();
        }, true);


        function enhanceMessage(message) 
        {
            message.ticket_url = 'https://gtpmain.wdf.sap.corp:443/sap/bc/webdynpro/qce/msg_gui_edit?csinsta=' + message.CSINSTA + '&mnumm=' + message.MNUMM + '&myear=' + message.MYEAR + '&sap-language=en#';
            if(message.SUSID !== "")
            {
                $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + message.SUSID + '&origin=' + location.origin).then(function (response) {
                    message.employee = response.data.DATA;
                    if(message.employee.BNAME !== "")
                    {
                        message.employee.TELNR = message.employee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                        message.url = 'https://people.wdf.sap.corp/profiles/' + message.SUSID;    
                        message.username = message.employee.VORNA + ' ' + message.employee.NACHN;
                        message.mail = message.employee.SMTP_MAIL;
                        message.tel = message.employee.TELNR;
                    }
                });
            }
        }

        function enhanceAllMessages() 
        {
            angular.forEach(ticketData.backendTickets.sel_components, function (message) { enhanceMessage(message); });
            angular.forEach(ticketData.backendTickets.sel_components_aa, function (message) { enhanceMessage(message); });
            angular.forEach(ticketData.backendTickets.colleagues, function (message) { enhanceMessage(message); });
            angular.forEach(ticketData.backendTickets.colleagues_aa, function (message) { enhanceMessage(message); });
            angular.forEach(ticketData.backendTickets.assigned_me, function (message) { enhanceMessage(message); });
            angular.forEach(ticketData.backendTickets.assigned_me_aa, function (message) { enhanceMessage(message); });
            angular.forEach(ticketData.backendTickets.created_me, function (message) { enhanceMessage(message); });            
        }

        $scope.getStatusArray = function(){
            return Object.keys($scope.statusMap);
        };

        $scope.$watch('config', function() {      
            if($scope.config !== undefined)
            {
                var selected_messages = [];                
                if($scope.config.data.selection.sel_components) { angular.forEach(ticketData.backendTickets.sel_components, function (message) { selected_messages.push(message); }); }
                if($scope.config.data.selection.colleagues)     { angular.forEach(ticketData.backendTickets.colleagues, function (message) { selected_messages.push(message); }); }
                if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketData.backendTickets.assigned_me, function (message) { selected_messages.push(message); }); }
                if($scope.config.data.selection.created_me)     { angular.forEach(ticketData.backendTickets.created_me, function (message) { selected_messages.push(message); }); }
                if(!$scope.config.data.settings.ignore_author_action)
                {
                    if($scope.config.data.selection.sel_components) { angular.forEach(ticketData.backendTickets.sel_components_aa, function (message) { selected_messages.push(message); }); }
                    if($scope.config.data.selection.colleagues)     { angular.forEach(ticketData.backendTickets.colleagues_aa, function (message) { selected_messages.push(message); }); }
                    if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketData.backendTickets.assigned_me_aa, function (message) { selected_messages.push(message); }); }
                }                                            
                $scope.messages = selected_messages;
                bridgeConfig.persistInBackend(bridgeDataService);                
            }
        },true);  

        $scope.zoom = function(index, event){
            $scope.zoomIndex = index;
            if (event) {
                $scope.zoomImg = event.currentTarget;
            };
        }
        if (ticketData.isInitialized.value === false) {
            var promise = ticketData.initialize();

            promise.then(function success() {
                enhanceAllMessages();
                $scope.config = configservice;
            });
        } else {
            enhanceAllMessages();
            $scope.config = configservice;
        }
}]);


