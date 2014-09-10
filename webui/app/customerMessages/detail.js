angular.module('app.customerMessages').controller('app.customerMessages.detailController',
    ['$scope', '$http', '$window', '$templateCache', 'app.customerMessages.ticketData','$routeParams', 'app.customerMessages.configservice', 'bridgeDataService', 'bridgeConfig', '$window',
    function Controller($scope, $http, $window, $templateCache, ticketData, $routeParams, configservice, bridgeDataService, bridgeConfig, window) {

        $scope.$parent.$parent.detailScreen.title = "Customer Incidents Details";
        $scope.filterText = '';
        $scope.messages = [];
        $scope.prios = ticketData.prios;
        $scope.statusMap = {};
        $scope.zoomIndex = -1;
        $scope.zoomedStyle = "";
        $scope.showNewOnly = false;


        function update_table()
        {
            $scope.tableData = [];
            var statusNumberMap = {};
            if($scope.messages && $scope.messages.length > 0)
            {
                if(!$scope.getStatusArray().length)
                {
                    if ($routeParams.prio) {
                        var status_filter = $routeParams.prio.split('|');
                    }

                    $scope.prios.forEach(function (prio){
                        if (!status_filter){
                            $scope.statusMap[prio.name] = {"active":true};
                            return;
                        }
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

                $scope.prios.forEach(function(prio){
                    statusNumberMap[prio.number] = prio.name;
                });

                $scope.messages.forEach(function (message){
                    message.PRIORITY_DESCR = statusNumberMap[message.PRIORITY_KEY];
                    if ($scope.statusMap[message.PRIORITY_DESCR].active) {
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
            if (!message.PROCESSOR && message.PROCESSOR_ID) {
                message.PROCESSOR = message.PROCESSOR_ID;
            }

            var username = message.PROCESSOR_NAME.split(" /");
            message.PROCESSOR_NAME = username[0];


            if(message.PROCESSOR)
            {
                $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + message.PROCESSOR + '&origin=' + $window.location.origin).then(function (response) {
                    message.employee = response.data.DATA;
                    if(message.employee.BNAME)
                    {
                        message.employee.TELNR = message.employee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                        message.url = 'https://people.wdf.sap.corp/profiles/' + message.PROCESSOR;
                        message.username = message.employee.VORNA + ' ' + message.employee.NACHN;
                        message.mail = message.employee.SMTP_MAIL;
                        message.tel = message.employee.TELNR;
                        if (!message.PROCESSOR_NAME) {
                            message.PROCESSOR_NAME = message.username;
                        }
                    }
                });
            }
        }

        function enhanceAllMessages()
        {
            ticketData.backendTickets.sel_components.forEach(enhanceMessage);
            ticketData.backendTickets.sel_components_aa.forEach(enhanceMessage);
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
                if (angular.equals(message, item)){
                    allreadyExists = true;
                }
                return allreadyExists;
            });

            if (!allreadyExists){
                $scope.messages.push(message);
            }
        }
        $scope.$watch('config', function() {
            var ticketsToShow;
            if($scope.config !== undefined)
            {
                var selected_messages = [];
                $scope.messages = selected_messages;

                if (!$routeParams.prio){
                    ticketsToShow = ticketData.ticketsFromNotifications;
                    $scope.$parent.$parent.detailScreen.title = "New/Changed Customer Incidents";
                } else {
                    ticketsToShow = ticketData.backendTickets;
                }

                if($scope.config.data.selection.sel_components) { angular.forEach(ticketsToShow.sel_components, addMessage); }
                if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketsToShow.assigned_me, addMessage); }
                if($scope.config.data.selection.created_me)     { angular.forEach(ticketsToShow.created_me, addMessage); }
                if(!$scope.config.data.settings.ignore_author_action)
                {
                    if($scope.config.data.selection.sel_components) { angular.forEach(ticketsToShow.sel_components_aa, addMessage); }
                    if($scope.config.data.selection.assigned_me)    { angular.forEach(ticketsToShow.assigned_me_aa, addMessage); }
                }
                bridgeConfig.store(bridgeDataService);
            }
        },true);

        function getOffset(element) {
            var rect = element.getBoundingClientRect();
            var top  = rect.top + $(window).scrollTop();
            var left = rect.left + $(window).scrollLeft();
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
