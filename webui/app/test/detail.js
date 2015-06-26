angular.module('app.test').controller(
	'app.test.detailController',
	[
		'$scope', 'app.test.dataService',
		function Controller($scope, dataService) {
			$scope.text = dataService.getText();
		}
	]
);
