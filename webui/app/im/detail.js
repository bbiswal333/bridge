angular.module('app.im').controller('app.im.detailController', ['$scope', '$http',
    function Controller($scope, $http) {
    
        $scope.$parent.titleExtension = " - IM Details";
         
		$scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
	    $http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS') + '&json=true'
	   
	        ).success(function(data) {
	        	
	            $scope.imData = data["asx:abap"];
	            $scope.imData = $scope.imData["asx:values"];
	            $scope.imData = $scope.imData[0];
	            $scope.groesse = new Array();

	       	 $scope.tempobject = [];
	       	   if ($scope.imData.INTCOMP_LONG[0] !== "") {
	       	   			var i = 0;
	  							while (i<$scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT.length) {

	       	   					$scope.tempobject.push($scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT[0]);
	       	   					i++;
	       	   				}
	       	   				

	       	   	
	       	   }
	       	   /*Falls man alle Meldungen bei Details anzeigen möchte --> einkommentieren!

	       	   if ($scope.imData.INTCOMPCOLLEAGUES_LONG[0] !== "") {
	       	   			var i = 0;

	           			while (i < $scope.imData.INTCOMPCOLLEAGUES_LONG[0].DEVDB_INTMESSAGE_OUT.length)	{	           	           				
	           					           		           				
	           				$scope.tempobject.push($scope.imData.INTCOMPCOLLEAGUES_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
		       		        i++;

		           		}
		           		
	       	   }

	       	
	       		 if($scope.imData.INTAUTHACTION_LONG[0] !== "") {
	       	   			var i = 0;
	       	   			while (i < $scope.imData.INTAUTHACTION_LONG[0].DEVDB_INTMESSAGE_OUT.length)	{
	       	   				$scope.tempobject.push($scope.imData.INTAUTHACTION_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
	       	   				i++;
		           		}

	       	   }

	       	   if($scope.imData.INTCREATED_LONG[0] !== "") {
	       	   			var i = 0;

	       	   			while (i < $scope.imData.INTCREATED_LONG[0].DEVDB_INTMESSAGE_OUT.length)	{
	       	   				$scope.tempobject.push($scope.imData.INTCREATED_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
	       	   				i++;
		           		}
	       	   }
   				*/

	       	   	
	            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

	        }).error(function(data) {
	            $scope.imData = [];
	            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
	        });

	 		
        
        } ] ) ;
