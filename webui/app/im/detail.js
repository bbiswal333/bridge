angular.module('app.im').controller('app.im.detailController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.$parent.titleExtension = " - IM Details";   		
	    $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?origin=' + location.origin 
	   		
	        ).success(function(data) {
	        	data = new X2JS().xml_str2json(data);
                $scope.imData = data["abap"];
                $scope.imData = $scope.imData["values"];	            
	       	 	$scope.tempobject = [];

	       	   	if ($scope.imData.INTCOMP_LONG !== "") {
	       	   		_.each($scope.imData.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (n) {
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


