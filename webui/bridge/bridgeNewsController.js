angular.module('bridge.app').controller('mainNewsController', [ '$scope', 'bridge.service.bridgeNews', function ($scope, newsService) {
	$scope.testText = "halloroman";
	$scope.news = newsService.news;
}]);

