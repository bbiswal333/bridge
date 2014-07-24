angular.module('app.imtps').controller('app.imtps.detailController', ['$scope', '$http', 'app.imtps.msgReaderData',
    function Controller($scope, $http, msgReaderData) {

        $scope.$parent.titleExtension = " - IM Details";
       
        msgReaderData.initService( function(messages){ 
			if( messages ){
				angular.forEach(messages["_-QBE_-S_MESSAGES"], function (n) {
       	   			$http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + n.SUSID + '&origin=' + location.origin).then(function (response) {
                        n.employee = response.data.DATA;
                        n.employee.TELNR = n.employee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                   		$scope.tempobject.push(n);
       	   			});
            	});
       	   		
       	   		$scope.tempobject = messages["_-QBE_-S_MESSAGES"];
			}

		});

} ] ) ;


