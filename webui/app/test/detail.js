angular.module('app.test').controller('app.test.detailController',['$scope', '$interval', 'app.test.dataService',
	function Controller($scope, $interval, dataService) {

	$scope.$parent.titleExtension = " - Test text";
	$scope.text = "";

	$scope.getDataForDetailsScreen = function() {
		$scope.text = dataService.getText();
	};
	$scope.getDataForDetailsScreen();

	$interval($scope.getDataForDetailsScreen(), 1000 * 60);
}]);
