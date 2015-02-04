angular.module('app.securityTesting').controller('app.securityTesting.detailController',['$scope', '$routeParams', 'app.securityTesting.dataService', 'app.securityTesting.configservice',	function Controller($scope, $routeParams, dataService, appSecurityTestingConfig) {
    $scope.results = [];

        $scope.$parent.titleExtension = " - " + $routeParams.system + " issues";
        $scope.handleResults = function () {
            var config = appSecurityTestingConfig.getConfigInstanceForAppId($routeParams.appid);


			dataService.loadDataDetailed($routeParams.system,config).then(function () {
                var aResults = null;

                aResults = dataService.data.securityTestingDetail;


                    $scope.results.length = 0;
                    for (var i = 0; i < aResults.length; i++) {
                        $scope.results.push({ "projectname": aResults[i].projectname, "open": aResults[i].opencount, "closed": aResults[i].closedcount });
                    }
                });
		};
		$scope.handleResults();
}]);
