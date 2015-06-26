angular.module("app.myFirstApp").controller(
	"app.myFirstApp.detailController",
	[
		"$scope", "$sce", "app.myFirstApp.dataService",
		function Controller($scope, $sce, dataService) {
			var userInput = dataService.getData();
			$scope.url = $sce.trustAsResourceUrl("https://www.dict.cc/?s=" + userInput);
		}
	]
);
