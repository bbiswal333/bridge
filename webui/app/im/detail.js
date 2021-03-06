angular.module('app.im').controller('app.im.detailController',
    ['$scope', '$http', '$window', 'app.im.ticketData', '$routeParams', 'app.im.configservice', 'bridgeDataService', 'bridgeConfig',
    function Controller($scope, $http, $window, ticketData, $routeParams, configservice, bridgeDataService, bridgeConfig) {

        configservice.initialize();

        $scope.$parent.titleExtension = " - IM Details";
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.statusMap = {};
        $scope.zoomIndex = -1;
        $scope.zoomedStyle = "";


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
                $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + message.SUSID + '&origin=' + $window.location.origin).then(function (response) {
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
            ticketData.backendTickets.sel_components.forEach(enhanceMessage);
            ticketData.backendTickets.sel_components_aa.forEach(enhanceMessage);
            ticketData.backendTickets.colleagues.forEach(enhanceMessage);
            ticketData.backendTickets.colleagues_aa.forEach(enhanceMessage);
            ticketData.backendTickets.assigned_me.forEach(enhanceMessage);
            ticketData.backendTickets.assigned_me_aa.forEach(enhanceMessage);
            ticketData.backendTickets.created_me.forEach(enhanceMessage);
        }

        $scope.getStatusArray = function(){
            return Object.keys($scope.statusMap);
        };

        function addMessage(message){
            var allreadyExists = false;
            $scope.messages.some(function(item){
                if (angular.equals(message.CSINSTA + message.MNUMM + message.MYEAR, item.CSINSTA + item.MNUMM + item.MYEAR)){
                //angular.equals(message, item)){
                    allreadyExists = true;
                }
                return allreadyExists;
            });

            if (!allreadyExists){
                $scope.messages.push(message);
            }
        }
        $scope.$watch('config', function() {
            if($scope.config !== undefined)
            {
                var selected_messages = [];
                $scope.messages = selected_messages;

                if($scope.config.data.selection.sel_components) { angular.forEach(ticketData.backendTickets.sel_components, addMessage); }
                if($scope.config.data.selection.colleagues)     { angular.forEach(ticketData.backendTickets.colleagues, addMessage); }
                if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketData.backendTickets.assigned_me, addMessage); }
                if($scope.config.data.selection.created_me)     { angular.forEach(ticketData.backendTickets.created_me, addMessage); }
                if(!$scope.config.data.settings.ignore_author_action)
                {
                    if($scope.config.data.selection.sel_components) { angular.forEach(ticketData.backendTickets.sel_components_aa, addMessage); }
                    if($scope.config.data.selection.colleagues)     { angular.forEach(ticketData.backendTickets.colleagues_aa, addMessage); }
                    if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketData.backendTickets.assigned_me_aa, addMessage); }
                }
                bridgeConfig.store(bridgeDataService);
            }
        },true);

        function getOffset(element) {
            var rect = element.getBoundingClientRect();
            var top  = rect.top + $($window).scrollTop();
            var left = rect.left + $($window).scrollLeft();
            return { top: Math.round(top), left: Math.round(left) };
        }

        $scope.zoom = function(index, event){
            var zoomImg = null;

            $scope.zoomIndex = index;
            if (event) {
                zoomImg = event.currentTarget;
                var imgOffset = getOffset(zoomImg);
                var left = imgOffset.left - 50 + (zoomImg.width / 2);
                var top = imgOffset.top - 50 + (zoomImg.height / 2);
                $scope.zoomedStyle = 'left:' + left + 'px; top:' + top + 'px;';
            }
        };

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
