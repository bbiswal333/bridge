angular.module("app.dictcc", ["app.dictcc.data"]);
angular.module("app.dictcc").directive(
	"app.dictcc",
	[
		"app.dictcc.dataService",
		function (dataService) {

			var controller = ["$scope", function ($scope) {

				$scope.saveUserInput = function() {
					dataService.setData($scope.input);
				};

			}];

			return {
				restrict: "E",
				templateUrl: "app/dictcc/overview.html",
				controller: controller
			};
		}
	]
);
