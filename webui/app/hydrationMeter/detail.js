angular.module('app.hydrationMeter').controller('app.hydrationMeter.detailController',['$scope', 'app.hydrationMeter.dataService',
	function Controller($scope, dataService) {

	$scope.text = dataService.getText();
}]);
