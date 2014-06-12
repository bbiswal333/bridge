angular.module('app.im').controller('app.im.detailController', ['$scope', '$http','$templateCache', 'app.im.ticketData','$routeParams',  function Controller($scope, $http, $templateCache, ticketData, $routeParams) {

        $scope.$parent.titleExtension = " - IM Details";   
        $scope.myOptions = { data: 'tempobject' };	    
        
        $scope.messages = [];
        $scope.data = {};        

        $scope.prios = [{
            name: "Very High", number: 1, amount: 0,
        }, {
            name: "High", number: 2, amount: 0,
        }, {
            name: "Medium", number: 3, amount: 0,
        }, {
            name: "Low", number: 4, amount: 0,
        }];

        $scope.$watch('messages', function () 
        {                        
            update_table();            
        }, true);

        $scope.$watch('data.status', function()
        {
            update_table();
        }, true);

        function update_table()
        {
            if($scope.messages && $scope.messages.length > 0)
            {
                if(!$scope.data.status)
                {
                    var status_filter = $routeParams['prio'].split('|'); 
                    var status = [];
                    $scope.data.status = [];  
                    for(var i = 0; i < $scope.prios.length; i++)
                    {
                        if(status_filter.indexOf($scope.prios[i].name) > -1)
                        {
                            status.push({"name":$scope.prios[i].name,"active":true});   
                        }
                        else
                        {
                            status.push({"name":$scope.prios[i].name,"active":false});   
                        }    
                    }

                    $scope.data.status = status;  
                }
                $scope.data.tableData = [];
                                
                for(var i = 0; i < $scope.messages.length; i++ )
                {
                    for(var j = 0; j < $scope.data.status.length; j++)
                    {
                        if($scope.messages[i].PRIOSTXT == $scope.data.status[j].name && $scope.data.status[j].active)
                        {
                            $scope.data.tableData.push($scope.messages[i]);
                        }
                    }
                } 
            }                      
        }

        var cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" style="border:2px solid white;height:40px">{{row.getProperty(col.field)}}</div>';
        var usercellTemplate = 
            '<div class="ngCellText " ng-class="col.colIndex()" style="border:2px solid white;height:40px">' + 
            '<img ng-src="https://avatars.wdf.sap.corp/avatar/{{row.entity.SUSID}}?s=20x20" style="height:100%;border-radius:100%;margin-right:20px"></img>' + 
            '<a target="_blank" href="{{row.entity.url}}">{{row.entity.username}}</a>' +
            ' <a href="mailto:{{row.entity.mail}}"><p class="box-icon_2 icon-mail"></p></a>' +
            ' <a href="tel:{{row.entity.tel}}"><p class="box-icon_3 icon-phone"></p></a>' +
            '</div>';
        var descriptioncellTemplate = 
            '<div class="ngCellText" ng-class="col.colIndex()" style="border:2px solid white;height:40px"><a target="_blank" href="{{row.entity.ticket_url}}">{{row.entity.KTEXT}}</a></div>';


        $scope.filterOptions = {
            filterText: ''
        };

        $scope.gridOptions = {                        
            enableColumnReordering:true,
            enableRowSelection:false,            
            rowHeight: 40,
            showFilter:false,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                {field:'PRIOSTXT', displayName:'Priority', width:'10%', cellTemplate: cellTemplate},                
                {field:'THEMKEXT', displayName:'Component', width:'15%', cellTemplate: cellTemplate},
                {field:'STATUSSTXT', displayName:'Status', width:'15%', cellTemplate: cellTemplate},      
                {field:'username', displayName:'Reporter/ Processor', width:'20%', cellTemplate: usercellTemplate},   
                {field:'KTEXT', displayName:'Description', width:'40%', cellTemplate: descriptioncellTemplate}            
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
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

        if (angular.isArray(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
            _.each(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (message) {
                enhanceMessage(message);
            });
        } else {
            enhanceMessage(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT);
        }
	 		     
}]);


