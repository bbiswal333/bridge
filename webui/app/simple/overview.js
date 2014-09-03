angular.module('app.simple', []);
angular.module('app.simple').directive('app.simple', function () {

	var directiveController = ['$scope', function ($scope) {
		$scope.appText = "Pretty simple app.";
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/simple/overview.html',
		controller: directiveController
	};
});
