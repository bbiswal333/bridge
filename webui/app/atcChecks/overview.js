angular.module('app.atcc', []);
angular.module('app.atcc').directive('app.atcc',['$http', function ($http) {

	var directiveController = ['$scope', function ($scope) {

		$http.get('https://ifp.wdf.sap.corp/sap/bc/abapcq/profiles?format=json&origin=' + location.origin).success(function(data){
			$scope.profiles = data.DATA;
		});

		$scope.appText = "All the checks";
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/atcChecks/overview.html',
		controller: directiveController
	};
}]);
