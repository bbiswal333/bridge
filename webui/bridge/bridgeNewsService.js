angular.module('bridge.service').service('bridge.service.bridgeNews', ['$modal', '$http', function ($modal, $http) {
    return {    
        show_news: function(newsID)
        {     
        	$http.get('../bridge/news/news.json').then(function(response) 
      		{
        		var news = response.data.news[newsID];
        		$modal.open({
                template:'<div class="news-header-badge">' +
							'<span class="image_rounded_shadow">' +
								'<img style="border-radius:100%;border:4px solid #418AC9" src="' + news.snapURL + '" width="100px" height="100px" />' +
							'</span>' +
							'<a href="' + news.gitURL + '">' +
								'<span class="news-icons">' +
									'<i class="fa fa-github fa-4x basic-blue-font-40"></i>' +
									'<br>' +
									'View it on Github' +
								'</span>' +
							'</a>' +
							'<h1 class="basic-blue-font news-headline">' + news.header + '</h1>' +
							'<div class="news-navi basic-blue-font">' +
								'<i class="fa fa-angle-left fa-4x" ng-click="show_news(' + (newsID - 1) + ')"></i>' +
								'<i class="fa fa-angle-right fa-4x" ng-click="show_news(' + (newsID + 1) + ')"></i>' +
							'</div>' +
					'</div>' +
					'<div class="news-header">' +	
						'<div class="news-content">' +
							news.content +
						'</div>' +
						'<div class="news-image">' +
							'<img src="' + news.img1 + '">' +
						'</div>' +
					'</div>' ,
                windowClass: 'settings-dialog'
    
            	});
      		});       
            

        }
       

    };

    
}]);



