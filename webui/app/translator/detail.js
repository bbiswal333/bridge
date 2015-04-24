angular.module('app.translator').controller('app.translator.detailController',['$scope', 'app.translator.dataService',
	function Controller($scope, dataService) {

	$scope.text = dataService.getText();
}]);
