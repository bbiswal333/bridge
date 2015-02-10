angular.module('app.profitCenter', []);
angular.module('app.profitCenter').directive('app.profitCenter',[function () {

	var directiveController = ['$scope', function ($scope) {
		$scope.appText = "Pretty simple app.";
		$scope.box.boxSize = 2;
		$scope.active = false;
		$scope.toggleActive = function() {
			$scope.active = !$scope.active;
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/profitCenter/overview.html',
		controller: directiveController
	};
}]);
