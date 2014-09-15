angular.module('bridge.app').controller('sidebarNewsController', [ '$scope', '$modal', 'bridge.service.bridgeNews', function ($scope, $modal, newsService) {
	$scope.news = newsService.news;
    $scope.selectedNews = newsService.selectedNews;

    $scope.show_news = function(selectedNews){
        newsService.selectedNews = selectedNews;
        $modal.open({
            templateUrl: 'bridge/sidebar/news/whatsNew.html',
            windowClass: 'settings-dialog'
        });
    };
}]);
