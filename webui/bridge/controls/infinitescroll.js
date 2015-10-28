angular.module('bridge.app').directive("infinitescroll", ["$window", function ($window) {
    return function (scope, elm) {
        var container = angular.element($window);
        var cont = container[0];

        container.bind("scroll", function () {
            var containerBottom = cont.scrollY + cont.outerHeight;
            var elementBottom = elm[0].scrollHeight + elm[0].offsetTop;
            //console.log(containerBottom, ' ', elementBottom);

            if (containerBottom >= elementBottom) {
                scope.$apply(scope.increaseInfinityLimit);
            } /*else if (cont.scrollTop === 0) {
             //should we reset limit to the initial size?
             }*/
        });
    };
}]);
