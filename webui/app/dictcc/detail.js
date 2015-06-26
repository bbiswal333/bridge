angular.module("app.dictcc").controller(
	"app.dictcc.detailController",
	[
		"$scope", "$sce", "app.dictcc.dataService",
		function Controller($scope, $sce, dataService) {
			var userInput = dataService.getData();
			$scope.url = $sce.trustAsResourceUrl("https://www.dict.cc/?s=" + userInput);
		}
	]
);
