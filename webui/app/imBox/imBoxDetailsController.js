 /*imBoxApp.controller('imDetailController', function ($scope) {
 			$scope.$parent.titleExtension = " - IM Details";
			$scope.testmessage = [{num: 1, stat: "Posted", proces: "Thomas"},
	 				{num: 2, stat: "Posted", proces: "Diana"},
	 				{num: 3, stat: "In Process", proces: "Werner"},
	 				{num: 4, stat: "Sent", proces: "Uwe"},
	 				{num: 5, stat: "Sent", proces: "Heide"},
	 				{num: 6, stat: "Canceled", proces: "Thomas"},
	 				{num: 7, stat: "In Process", proces: "Thomas"},
	 				{num: 8, stat: "In Process", proces: "Thomas"},
	 				{num: 9, stat: "In Process", proces: "Patrick"},
	 				{num: 10, stat: "Posted", proces: "Florian"},
	 				{num: 11, stat: "Sent", proces: "Axel"},
	 				{num: 12, stat: "Sent", proces: "Thomas"}
	 				];


	 		{
    		var size = 0, key;
    		for (key in $scope.testmessage) {
        		if ($scope.testmessage.hasOwnProperty(key)) size++;
    		}
    		
			};
	 		var forlast = size;
	 		if(forlast == 0 ) 
	 		$scope.lastElement = "You have no internal messages to display!";
	 		else
	 			$scope.lastElement = "You have internal messages (" + forlast + ")!"

	});
 imBox.getMessageforQuery(imQuery, $scope);
/*/
imBoxApp.controller('imDetailController', ['$scope', '$http',
    function Controller($scope, $http) {
        $scope.$parent.titleExtension = " - IM Details";
         
		$scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
	    $http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS') + '&format=json'
	        ).success(function(data) {
	            $scope.imData = data;
	            console.log($scope.imData);
	            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

	        }).error(function(data) {
	            $scope.imData = [];
	            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
	        });
        
        }]);
