angular.module('bridge.search').service('bridge.search.tetris', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-smile-o",
            name: "Easter Egg",
            defaultSelected: true
        };
    };
    this.findMatches = function(query, resultArray) {
        if (query.toUpperCase() === "TETRIS") {
            resultArray.push({title: "Tetris", link: "/#/tetris"});
        }
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open(selectedItem.link);
        };
    };
}]);
