angular.module('bridge.service').service('bridge.service.bridgeNews', ['$modal', '$http', function ($modal, $http) {
    var that = this;

    this.news = {};
    $http.get('../bridge/sidebar/news/news.json').then(function(response)
    {
        that.news = response.data.news;
    });

}]);
