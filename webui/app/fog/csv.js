(function() {
    'use strict';

    function link(_, __, ___, ngModel) {
        ngModel.$parsers.push(function(value) {
            return (value || '').split(/,\s*/gm).filter(function(token) {
                // Remove empty strings
                return !!token;
            });
        });
    }

    function CSVDirective() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    }

    angular.module('app.fog').directive('app.fog.csv', [
        CSVDirective
    ]);

}());
