angular.module('app.upportNotes', []);
angular.module('app.upportNotes').directive('app.upportNotes',[function () {

	var directiveController = ['$scope', function ($scope) {
		$scope.appText = "Pretty simple app.";
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/upportNotes/overview.html',
		controller: directiveController
	};
}]);
