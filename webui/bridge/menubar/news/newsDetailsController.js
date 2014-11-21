angular.module('bridge.app').controller('bridge.newsDetailController', [ '$scope', 'bridge.service.bridgeNews', function ($scope, newsService) {
	$scope.news = [];
	newsService.initialize().then(function() {
		$scope.news = newsService.news.data.reverse();
	});

    $scope.closeModal = function(){
        newsService.modalInstance.close();
    };
}]);
