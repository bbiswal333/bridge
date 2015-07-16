(function() {
    'use strict';

    function DetailDirective() {
        return {
            restrict: 'E',
            templateUrl: 'app/fog/detail/detail.html',
            controller: 'app.fog.controller',
            controllerAs: 'fog'
        };
    }

    angular.module('app.fog').directive('app.fog.detail', [
        DetailDirective
    ]);

}());
