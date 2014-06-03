angular.module('app.im').controller('app.im.detailController', ['$scope', '$http','$templateCache', function Controller($scope, $http, $templateCache) {

        $scope.$parent.titleExtension = " - IM Details";   
        $scope.myOptions = { data: 'tempobject' };	    

        $scope.messages = [];

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

	    $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?origin=' + location.origin 
	   		
	        ).success(function(data) {
	        	data = new X2JS().xml_str2json(data);
                $scope.imData = data["abap"];
                $scope.imData = $scope.imData["values"];	 

	       	   	if ($scope.imData.INTCOMP_LONG !== "") {
	       	   		_.each($scope.imData.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (message) {
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
                	});
	       	   	}	            
                                

	        }).error(function(data) {
	            $scope.imData = [];	            
	        }); 		 		     
        }
]);


