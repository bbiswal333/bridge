'use strict';
angular.module("bridge.app").directive("bridge.mobileDashboard", ["$http", "$compile",
    function($http, $compile, $sce) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){

               var url = attrs.templateUrl;
                $http.get(url)
                    .success(function(data) {
                        element.html(data);
                        $compile(element.contents())(scope);
                    });
            }
        };
    }]);