angular.module("bridge.app").directive("bridge.menubar", ["$popover", "bridge.menubar.weather.weatherData", "bridge.menubar.weather.configservice", "bridge.service.bridgeNews",
    function($popover, weatherData, weatherConfig, newsService) {
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
                    newsService.initialize();
                }
                $scope.existUnreadNews = newsService.existUnreadNews;

                $scope.changeSelectedApps = function() {
                        $scope.toggleDragging();
                        $scope.displayView('apps');
                };

                $scope.weatherData = weatherData.getData();
                $scope.weatherConfig = weatherConfig.getConfig();
                $scope.$watch('weatherConfig', function() {
                    weatherData.loadData();
                }, true);
            }
        };
}]);

$('body').on('mousedown', function (e) {
    $('[data-toggle="popover"]').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.menubar-popover').has(e.target).length === 0 && $('.menubar-popover').scope()) {
            $('.menubar-popover').scope().$hide();
        }

        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0 && $('.popover').scope()) {
            $('.popover').scope().$hide();
        }
    });
});
