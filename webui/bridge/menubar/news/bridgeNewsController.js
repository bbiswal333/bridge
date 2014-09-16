angular.module('bridge.app').controller('bridge.menubar.newsController', [ '$scope', '$modal', 'bridge.service.bridgeNews', function ($scope, $modal, newsService) {
	$scope.news = newsService.news;
    $scope.selectedNews = newsService.selectedNews;

    $scope.show_news = function(selectedNews){
        newsService.selectedNews = selectedNews;
        $modal.open({
            templateUrl: 'bridge/menubar/news/whatsNew.html',
            windowClass: 'settings-dialog'
        });
    };
}]);
