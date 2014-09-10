angular.module('bridge.service').service('bridge.service.bridgeNews', ['$modal', '$http', function ($modal, $http) { 
        var that = this;

        this.show_news = function(newsID)
        {     
        	$http.get('../bridge/news/news.json').then(function(response) 
      		{
        		that.news = response.data.news[newsID];
        		$modal.open({
	                templateUrl: 'view/whatsNew.html',
	                windowClass: 'settings-dialog'
    
            	});
      		});       
            

        },
        this.news = {};

    
}]);



