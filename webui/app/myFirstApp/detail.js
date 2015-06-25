angular.module('app.myFirstApp').controller('app.myFirstApp.detailController',['$scope', 'app.myFirstApp.dataService',
	function Controller($scope, dataService) {

	$scope.text = dataService.getText();
}]);
