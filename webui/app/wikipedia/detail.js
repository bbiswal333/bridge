angular.module("app.wikipedia").controller(
	"app.wikipedia.detailController",
	[
		"$scope", "$sce", "app.wikipedia.dataService",
		function Controller($scope, $sce, dataService) {
			var userInput = dataService.getData();
			$scope.url = $sce.trustAsResourceUrl("https://en.wikipedia.org/wiki/" + userInput);
		}
	]
);
