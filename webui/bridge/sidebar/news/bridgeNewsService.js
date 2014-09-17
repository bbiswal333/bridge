angular.module('bridge.service').service('bridge.service.bridgeNews', ['$http', function ($http) {
    var that = this;
    this.news = {};
    this.isInitialized = false;
    this.selectedNews = null;

    this.initialize = function(){
        var loadNewsPromise = $http.get('../bridge/sidebar/news/news.json');
        loadNewsPromise.then(function(response) {
            that.news.data = response.data.news;
            that.isInitialized = true;
        });

        return loadNewsPromise;
    };

}]);
