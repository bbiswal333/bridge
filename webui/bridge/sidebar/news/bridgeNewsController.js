angular.module('bridge.app').controller('sidebarNewsController', [ '$scope', '$modal', 'bridge.service.bridgeNews', function ($scope, $modal, newsService) {
    if (newsService.isInitialized === false) {
        newsService.initialize();
    }

	$scope.news = newsService.news;

    $scope.show_news = function(selectedNews){
        newsService.selectedNews = selectedNews;
        $modal.open({
            templateUrl: 'bridge/sidebar/news/whatsNew.html',
            windowClass: 'settings-dialog'
        });
    };

    $scope.selectTab = function(sTab){
        $scope.selectedTab = sTab;
    };
}]);
