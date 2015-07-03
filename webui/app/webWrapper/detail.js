angular.module("app.webWrapper").controller(
	"app.webWrapper.detailController",
	[
		"$scope", "$sce", "app.webWrapper.dataService",
		
		function Controller($scope, $sce, dataService) {
			var url = dataService.getUrl();
			var userInput = dataService.getInput();
			var url = url.replace("%P%", userInput);
			
			if (url === "") {
				$scope.url = ""
				$scope.message = "Please configure a URL for your web request first!";
			} else {
				$scope.url = $sce.trustAsResourceUrl(url);
				$scope.message = "";
			}
		}
	]
);
