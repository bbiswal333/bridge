angular.module('app.im').controller('app.im.detailController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.$parent.titleExtension = " - IM Details";
         $scope.selectedEmployees = [];
		$scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
	    $http.get('/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS') + '&json=true'
	   		
	        ).success(function(data) {
	        	
	            $scope.imData = data["asx:abap"];
	            $scope.imData = $scope.imData["asx:values"];
	            $scope.imData = $scope.imData[0];
	       	 	$scope.tempobject = [];

	       	   	if ($scope.imData.INTCOMP_LONG[0] !== "") {
	       	   		_.each($scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT, function (n) {
	       	   			$http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + n.SUSID[0] + '&origin=' + location.origin).then(function (response) {
	                        n.employee = response.data.DATA;
	                        n.employee.TELNR = n.employee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                       		$scope.tempobject.push(n);
	       	   			});
                	});
		  	
	       	   	}
	            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

	        }).error(function(data) {
	            $scope.imData = [];
	            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
	        });
        } ] ) ;


