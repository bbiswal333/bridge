angular.module('bridge.service').service('bridge.service.bridgeNews', function ($modal) {
    return {    
        show_news: function()
        {            
            $modal.open({
                templateUrl: 'view/news-detail.html',
                windowClass: 'settings-dialog'
                
            });
        }
    };
});