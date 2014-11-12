angular.module("bridge.app").directive("bridge.menubar", ["$modal", "bridge.menubar.weather.weatherData", "bridge.menubar.weather.configservice", "bridge.service.bridgeNews", "notifier", "$location",
    function($modal, weatherData, weatherConfig, newsService, notifier, $location) {

        function isDateYoungerThanOneMonth(dateString) {
            var newsDate = new Date(dateString);
            var now = new Date();
            if(newsDate.setMonth(newsDate.getMonth() + 1) > now.getTime()) {
                return true;
            }
            return false;
        }

        return {
            restrict: "E",
            templateUrl: "bridge/menubar/MenuBar.html",
            controller: function($scope) {
                $scope.displayView = function(view) {
                        if($scope.display === view) {
                                $scope.display = "";
                                return;
                        }
                        $scope.display = view;

                        if($scope.display !== "apps") {
                                $scope.stopDragging();
                        }
                };

                if (newsService.isInitialized === false){
                    newsService.initialize().then(function() {
                        if(newsService.existUnreadNews()) {
                            var unreadNews = newsService.getUnreadNews();
                            unreadNews.map(function(news) {
                                if(isDateYoungerThanOneMonth(news.date)) {
                                    notifier.showInfo(news.header, news.preview, "", function() {
                                        $location.path("/whatsNew");
                                    });
                                }
                            });
                            newsService.markAllNewsAsRead();
                        }
                    });
                }

                $scope.changeSelectedApps = function() {

                $(".navicon-button").removeClass("open");
                    $modal.open({
                      templateUrl: 'bridge/menubar/applications/bridgeApplications.html',
                      size: 'lg'
                    });
                };

                $scope.weatherData = weatherData.getData();
            }
        };
}]);


$('body').on('mousedown', function (e) {
    $('[data-toggle="popover"]').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.menubar-popover').has(e.target).length === 0 && $('.menubar-popover').scope()) {
            $('.menubar-popover').scope().$apply(function() { $('.menubar-popover').scope().$hide(); });
            //$('.menubar-popover').scope().$hide();
        }

        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0 && $('.popover').scope()) {
            $('.popover').scope().$apply(function() { $('.popover').scope().$hide(); });
            //$('.popover').scope().$hide();

        }
         $(".navicon-button").addClass("open");
    });
});
