angular.module('app.imtl').controller('app.imtl.detailController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.$parent.titleExtension = " - IM Details";   		
	    $http.get('https://gte.wdf.sap.corp/sap/bc/devdb/MSGSFROMMYTPS?user=D055469&origin=' + location.origin 
	   		
	        ).success(function(data) {
	        	
	        	data = new X2JS().xml_str2json(data);
                $scope.imData = data["abap"];
                $scope.imData = $scope.imData["values"];	            
	       	 	$scope.tempobject = [];

	       	   	if ($scope.imData["TC_MESSAGES"]["_-QBE_-S_MESSAGES"] !== "") {
	       	   		_.each($scope.imData["TC_MESSAGES"]["_-QBE_-S_MESSAGES"], function (n) {
	       	   			$http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + n.SUSID + '&origin=' + location.origin).then(function (response) {
	                        n.employee = response.data.DATA;
	                        n.employee.TELNR = n.employee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                       		$scope.tempobject.push(n);
	       	   			});
                	});
	       	   	}	            
     

	        }).error(function(data) {
	            $scope.imData = [];	            
	        });
        } ] ) ;


