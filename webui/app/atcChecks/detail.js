angular.module('app.atcc').controller('app.atcc.detailController',['$scope','$routeParams','$http',
	function Controller($scope, $routeParams, $http) {	

		$scope.data = {};
		$scope.data.prio = {};
		$scope.data.prio.p1_active = true;
		$scope.data.prio.p2_active = true;
		$scope.data.prio.p3_active = true;
		$scope.data.prio.p4_active = true;

		function filter_data()
		{
			$scope.data.filtered_profile = [];
			if($scope.data.profile && $scope.data.prio)
            {
                $scope.data.profile.forEach(function (entry){
                    if((entry.CENTRAL_PRIO === "1" && $scope.data.prio.p1_active) || (entry.CENTRAL_PRIO === "2" && $scope.data.prio.p2_active) || (entry.CENTRAL_PRIO === "3" && $scope.data.prio.p3_active) || (entry.CENTRAL_PRIO === "4" && $scope.data.prio.p4_active))
                    {
                        $scope.data.filtered_profile.push(entry);
                    }
                });
            }
		}

		$http.get('https://ifp.wdf.sap.corp/sap/bc/abapcq/definition/' + $routeParams.profile + '?format=json&origin=' + location.origin).success(function(data){			
			$scope.data.profile = data.DATA;	
			filter_data();						
		});


		$scope.$watch('data.prio', function()
        {
			filter_data();                        
        }, true);
}]);
