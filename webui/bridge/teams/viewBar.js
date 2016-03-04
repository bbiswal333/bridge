angular.module("bridge.teams").directive("bridge.viewBar", [
    function() {
        return {
            restrict: "E",
            templateUrl: "bridge/teams/viewBar.html",
            controller: "bridge.viewBar.Controller"
        };
}]);
