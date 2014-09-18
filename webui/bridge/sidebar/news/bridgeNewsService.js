angular.module('bridge.service').service('bridge.service.bridgeNews', ['$http', 'bridgeDataService', function ($http, bridgeDataService) {
    var that = this;
    this.news = {};
    this.isInitialized = false;
    this.selectedNews = null;
    this.modalInstance = null;

    this.initialize = function(){
        var loadNewsPromise = $http.get('../bridge/sidebar/news/news.json');
        loadNewsPromise.then(function(response) {
            that.news.data = response.data.news;
            that.isInitialized = true;
        });

        return loadNewsPromise;
    };

    this.existUnreadNews = function(){
        var readNews = bridgeDataService.getBridgeSettings().readNews;

        for (var i = 0; i < that.news.data.length; i++){
            if (!_.contains(readNews, that.news.data[i].id)){
                return true;
            }
        }

        return false;
    };

}]);
