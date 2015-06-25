angular.module('app.myFirstApp').controller(
	'app.myFirstApp.detailController',
	[
		'$scope',
		function Controller($scope) {
			$scope.text = "whoa!";
		}
	]
);
