angular.module('app.imtps').controller('app.imtps.detailController', ['$scope', '$http', 'app.imtps.msgReaderData', 'employeeService', 'app.imtps.configservice',
    function Controller($scope, $http, msgReaderData,employeeService, configservice) {

        $scope.$parent.titleExtension = " - IM Details";
       
        msgReaderData.initService( function(messages){ 
			if( messages ){
				var arraytmp = [];
				$scope.tempobject = messages["_-QBE_-S_MESSAGES"];
       	   		
				angular.forEach(messages["_-QBE_-S_MESSAGES"], function (n) {
					if( n.MSG_CREATED_BY_UID != '' ){
						n.employee_created = employeeService.getData( n.MSG_CREATED_BY_UID );
						n.employee_created.url = 'https://people.wdf.sap.corp/profiles/' + n.MSG_CREATED_BY_UID;    
						n.employee_created.username = n.employee_created.VORNA + ' ' + n.employee_created.NACHN;
						n.employee_created.mail = n.employee_created.SMTP_MAIL;
						n.employee_created.tel = n.employee_created.TELNR;
					}
					
					if( n.MSG_PROCESSOR_UID != ''){
						n.employee_process = employeeService.getData( n.MSG_PROCESSOR_UID );
						n.employee_process.url = 'https://people.wdf.sap.corp/profiles/' + n.MSG_PROCESSOR_UID;    
						n.employee_process.username = n.employee_process.VORNA + ' ' + n.employee_process.NACHN;
						n.employee_process.mail = n.employee_process.SMTP_MAIL;
						n.employee_process.tel = n.employee_process.TELNR;
					}
            	});
			}

		});

} ] ) ;


