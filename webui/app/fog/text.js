(function() {
    'use strict';

    function TextDirective($document, config, data, caret, highlight) {

        function link(_, element, attrs, ngModel) {

            var placeholderHtml = '<i class="box-content">' + attrs.placeholder + '</i>';

            ngModel.$render = function() {
                if(ngModel.$viewValue && ngModel.$viewValue.valueOf()) {
                    caret.preserve(element[0], function() {
                        // Put view value
                        element.html(highlight.wrap(
                            ngModel.$viewValue,
                            ngModel.$viewValue.complexWords,
                            { 'style': 'color:' + config.highlight.complexWords }
                        ));
                    });
                } else if($document[0].activeElement !== element[0]) {
                    // Put placeholder
                    element.html(placeholderHtml);
                }
            };

            element.bind('keyup change', function () {
                var viewValue = data.calculate(element.text());
                // Note: $viewValue is an instance of String object and
                // needs to be converted to it's primitive representation
                // before using strict type comparison with another
                // string primitive value
                if((ngModel.$viewValue && ngModel.$viewValue.valueOf()) !== element.text()) {
                    ngModel.$setViewValue(viewValue);
                    ngModel.$render();
                }
            });

            element.bind('focus', function () {
                if(!ngModel.$viewValue || !ngModel.$viewValue.valueOf()) {
                    // Remove placeholder
                    element.html('');
                }
            });

            element.bind('blur', function () {
                if(!ngModel.$viewValue || !ngModel.$viewValue.valueOf()) {
                    // Put placeholder
                    element.html(placeholderHtml);
                }
            });
        }

        function compile(_, attrs) {
            if(!attrs.hasOwnProperty('placeholder')) {
                attrs.$set('placeholder', 'Put text here');
            }
            if(!attrs.hasOwnProperty('contenteditable')) {
                attrs.$set('contenteditable', 'true');
            }
            return {
                post: link
            };
        }

        return {
            restrict: "E",
            require: "ngModel",
            compile: compile
        };

    }

    angular.module('app.fog').directive('app.fog.text', [
        '$document',
        'app.fog.config',
        'app.fog.data',
        'app.fog.caret',
        'app.fog.highlight',
        TextDirective
    ]);

}());
