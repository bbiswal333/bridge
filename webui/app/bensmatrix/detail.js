angular.module('app.bensmatrix').controller('app.bensmatrix.detailController',['$scope', 'app.bensmatrix.dataService',
	function Controller($scope, dataService) {

	$scope.text = dataService.getText();
}]);
