angular.module('bridge.service').service('bridge.service.bridgeNews', ['$http', 'bridgeDataService', 'bridgeInstance', function ($http, bridgeDataService, bridgeInstance) {
    var that = this;
    this.news = {};
    this.isInitialized = false;
    this.selectedNews = null;
    this.modalInstance = null;

    this.initialize = function(){
        var loadNewsPromise = $http({ method: 'GET', url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_NOTIFICATIONS?instance=' + bridgeInstance.getCurrentInstance()});

        loadNewsPromise.then(function(response) {
            that.news.data = response.data.NOTIFICATIONS.map(
                function(item) {
                    // yyyy-mm-dd
                    var time = item.TIMESTAMP.toString();
                    var dateString = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8);
                    return {
                        id: item.ID,
                        header: item.HEADER,
                        date: dateString,
                        snapURL: item.SNAPURL,
                        preview: item.PREVIEW,
                        content: item.CONTENT,
                        instance: item.INSTANCE
                    };
                });
            that.isInitialized = true;
        });

        return loadNewsPromise;
    };

    this.existUnreadNews = function(){
        var readNews = bridgeDataService.getBridgeSettings().readNews;

        if (that.isInitialized === false){
            return false;
        }

        for (var i = 0; i < that.news.data.length; i++){
            if (!_.contains(readNews, that.news.data[i].id)){
                return true;
            }
        }

        return false;
    };

    this.getUnreadNews = function(){
        var readNews = bridgeDataService.getBridgeSettings().readNews;
        var unreadNews = [];

        for (var i = 0; i < that.news.data.length; i++){
            if (!_.contains(readNews, that.news.data[i].id)){
                unreadNews.push(that.news.data[i]);
            }
        }

        return unreadNews;
    };

    this.markAllNewsAsRead = function() {
        var bridgeSettings = bridgeDataService.getBridgeSettings();

        if (bridgeSettings.readNews === undefined){
            bridgeSettings.readNews = [];
        } else {
            bridgeSettings.readNews.length = 0;
        }

        for (var i = 0; i < this.news.data.length; i++){
            bridgeSettings.readNews.push(this.news.data[i].id);
        }
    };

    this.markItemAsRead = function(newsItem) {
        var bridgeSettings = bridgeDataService.getBridgeSettings();

        if (bridgeSettings.readNews === undefined) {
            bridgeSettings.readNews = [];
        }

        bridgeSettings.readNews.push(newsItem.id);
    };

}]);
