angular.module('bridge.app').controller('sidebarNewsController', [ '$scope', '$modal', 'bridge.service.bridgeNews', 'bridgeDataService', function ($scope, $modal, newsService, bridgeDataService) {
    if (newsService.isInitialized === false) {
        newsService.initialize();
    }

	$scope.news = newsService.news;
    $scope.selectedTab = 'new';

    $scope.show_news = function(selectedNews){
        newsService.selectedNews = selectedNews;
        $modal.open({
            templateUrl: 'bridge/sidebar/news/newsDetail.html',
            windowClass: 'settings-dialog'
        });
    };

    $scope.filterList = function(oNewsItem){
        var isItemRead = _.contains(bridgeDataService.getBridgeSettings().readNews, oNewsItem.id);
        if ($scope.selectedTab === 'new'){
            return !isItemRead;
        } else {
            return isItemRead;
        }
    };

    $scope.selectTab = function(sTab){
        $scope.selectedTab = sTab;
    };

    $scope.markAllNewsAsRead = function() {
        var bridgeSettings = bridgeDataService.getBridgeSettings();

        if (bridgeSettings.readNews === undefined){
            bridgeSettings.readNews = [];
        } else {
            bridgeSettings.readNews.length = 0;
        }

        for (var i = 0; i < $scope.news.data.length; i++){
            bridgeSettings.readNews.push($scope.news.data[i].id);
        }
    };
}]);
