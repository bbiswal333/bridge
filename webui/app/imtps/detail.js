angular.module('app.imtps').controller('app.imtps.detailController', ['$scope', '$http', 'app.imtps.msgReaderData', 'employeeService', 'app.imtps.configservice', '$routeParams' ,
	function Controller($scope, $http, msgReaderData,employeeService, configservice, $routeParams) {

        $scope.$parent.titleExtension = " - IM Details";

        if (configservice.isInitialized === false) {
        	configservice.initialize($routeParams.appId);
        }

		$scope.userClick = function(employeeDetails){
			employeeService.showEmployeeModal(employeeDetails);
		};

        msgReaderData.initService( function(messages){
			if( messages ){
				$scope.tempobject = messages["_-QBE_-S_MESSAGES"];

				angular.forEach(messages["_-QBE_-S_MESSAGES"], function (n) {
					if( n.MSG_CREATED_BY_UID !== '' ){
						employeeService.getData( n.MSG_CREATED_BY_UID).then(function success(employeeData){
							n.employee_created = employeeData;
							n.employee_created.url = 'https://people.wdf.sap.corp/profiles/' + n.MSG_CREATED_BY_UID;
							n.employee_created.username = n.employee_created.VORNA + ' ' + n.employee_created.NACHN;
							n.employee_created.mail = n.employee_created.SMTP_MAIL;
							n.employee_created.tel = n.employee_created.TELNR;
						});

					}

					if( n.MSG_PROCESSOR_UID !== ''){
						employeeService.getData( n.MSG_PROCESSOR_UID).then(function success(employeeData){
							n.employee_process = employeeData;
							n.employee_process.url = 'https://people.wdf.sap.corp/profiles/' + n.MSG_PROCESSOR_UID;
							n.employee_process.username = n.employee_process.VORNA + ' ' + n.employee_process.NACHN;
							n.employee_process.mail = n.employee_process.SMTP_MAIL;
							n.employee_process.tel = n.employee_process.TELNR;
						});
					}
            	});
			}
		});
}]);
