angular.module("app.wikipedia", ["app.wikipedia.data"]);
angular.module("app.wikipedia").directive(
	"app.wikipedia", 
	[
		"app.wikipedia.dataService", 
		function (dataService) {

			var controller = ["$scope", function ($scope) {
		
				$scope.saveUserInput = function() {
					dataService.setData($scope.input);
				};
				
			}];
		
			return {
				restrict: "E",
				templateUrl: "app/wikipedia/overview.html",
				controller: controller
			};
		}
	]
);
