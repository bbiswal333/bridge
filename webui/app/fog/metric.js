(function() {
    'use strict';

    var template = '<span title="{{::metric.description}}">{{::metric.abbreviation}}: {{c.format(metric.value)}}{{::metric.units}}</span>';

    function MetricDirectiveController($scope) {
        this.format = function (expression) {
            // Similar to Number.toFixed(2), but for integer values don't show fraction part
            return Math.round(($scope.$eval('data.' + expression) || 0) * 100) / 100;
        };
    }

    function MetricDirective() {

        return {
            template: template,
            restrict: 'E',
            scope: {
                metric: '=',
                data: '='
            },
            controller: [
                '$scope',
                MetricDirectiveController
            ],
            controllerAs: 'c'
        };

    }

    angular.module('app.fog').directive('app.fog.metric', [
        MetricDirective
    ]);

}());
