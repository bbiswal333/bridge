angular.module('bridge.app').controller('bridge.app.detailController', ['$scope', '$routeParams','routeInfo', 'appInfo', function ($scope, $routeParams, routeInfo, appInfo) {		
	$scope.detailScreen = {};
    $scope.detailScreen.htmlPage = routeInfo.templateUrl;
    $scope.detailScreen.route = routeInfo.route;
    $scope.detailScreen.title = appInfo.title;
    $scope.detailScreen.icon_css = appInfo.icon_css;    

    var infinityLimitStep = 100;
    $scope.infinityLimit = infinityLimitStep;
    $scope.reverse = true;
    $scope.predicate = null;

    $scope.zebraCell = function (index) {
        return 'row' + index % 2;
    };
    $scope.increaseInfinityLimit = function () {
        $scope.infinityLimit += infinityLimitStep;
    };
    $scope.sort = function (selector) {
        $scope.predicate = selector;
        $scope.reverse = !$scope.reverse;
    };
}]);


angular.module('bridge.app').directive("infinitescroll", [function () {
    return function (scope, elm) {
        var container = angular.element(document.querySelector('#scrollContainer'));
        var cont = container[0];

        container.bind("scroll", function () {
            var containerBottom = cont.scrollTop + cont.offsetHeight;
            var elementBottom = elm[0].scrollHeight + elm[0].offsetTop;

            if (containerBottom >= elementBottom) {
                scope.$apply(scope.increaseInfinityLimit());
            } /*else if (cont.scrollTop === 0) {
                //should we reset limit to the initial size?
            }*/
        });
    };
}]);
