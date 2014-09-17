angular.module("bridge.app").directive("bridge.menubar", ["$popover", "bridge.menubar.weather.weatherData", function($popover, weatherData) {
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
                        
                        $scope.changeSelectedApps = function() {
                                $scope.toggleDragging();
                                $scope.displayView('apps');
                        };

                        $scope.weatherData = weatherData.getData();
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
