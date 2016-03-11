angular.module('bridge.app').directive('bridge.input', ['$timeout', function($timeout) {

    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/input.html',
        replace: true,
        compile: function(element, attrs) {
            // set default type if not given by the directive-definition
            if (_.isUndefined(attrs.type)) {
                attrs.type = "text";
            }

            if(attrs.placeholder) {
                $('input', element)[0].setAttribute("placeholder", attrs.placeholder);
            }
            if(attrs.inputTypeaheadAppendToBody) {
                $('input', element)[0].setAttribute("typeahead-append-to-body", attrs.inputTypeaheadAppendToBody);
            }
            if(attrs.type) {
                $('input', element)[0].setAttribute("type", attrs.type);
            }

            if(attrs.model) {
                $('input', element)[0].setAttribute("ng-model", attrs.model);
            }

            if(attrs.inputTypeahead) {
                $('input', element)[0].setAttribute("typeahead", attrs.inputTypeahead);
            }

            if(attrs.inputTypeaheadEditable) {
                $('input', element)[0].setAttribute("typeahead-editable", attrs.inputTypeaheadEditable);
            }

            if(attrs.inputTypeaheadOnSelect) {
                $('input', element)[0].setAttribute("typeahead-on-select", attrs.inputTypeaheadOnSelect);
            }

            if(attrs.inputTypeaheadTemplateUrl) {
                $('input', element)[0].setAttribute("typeahead-template-url", attrs.inputTypeaheadTemplateUrl);
            }

            if(attrs.inputTypeaheadWaitMs) {
                $('input', element)[0].setAttribute("typeahead-wait-ms", attrs.inputTypeaheadWaitMs);
            }

            if(attrs.inputTypeaheadMinLength) {
                $('input', element)[0].setAttribute("typeahead-min-length", attrs.inputTypeaheadMinLength);
            }

            if(attrs.change) {
                $('input', element)[0].setAttribute("ng-change", attrs.change);
            }

            if(attrs.maxlength) {
                $('input', element)[0].setAttribute("maxlength", attrs.maxlength);
            }

            if(attrs.focus) {
                $('input', element)[0].setAttribute("ng-focus", attrs.focus);
            }

            if(attrs.blur) {
                $('input', element)[0].setAttribute("ng-blur", attrs.blur);
            }

            if(attrs.cancel) {
                $('input', element)[0].setAttribute("ng-cancel", attrs.cancel);
            }

            if(attrs.id) {
                $('input', element)[0].setAttribute("id", attrs.id + "-input");
            }

            if(attrs.required && attrs.required === "true") {
                $('input', element)[0].setAttribute("required", "required");
            }

            if(attrs.ngDisabled) {
                $('input', element)[0].setAttribute("ng-disabled", attrs.ngDisabled);
            }

            if(attrs.inputFocusOn) {
                $('input', element)[0].setAttribute("focus-on", attrs.inputFocusOn);
            }

            if(attrs.ngRequired) {
                $('input', element)[0].setAttribute("ng-required", attrs.ngRequired);
            }

            if(attrs.ngKeypress) {
                $('input', element)[0].setAttribute("ng-keypress", attrs.ngKeypress);
            }

            if(attrs.enter) {
                $('input', element)[0].setAttribute("ng-enter", attrs.enter);
            }

            if(attrs.width) {
                $('input', element)[0].setAttribute("width", attrs.width);
            }

            if(attrs.icon) {
                var html = '<i class="fa ' + attrs.icon + '" style="position: absolute; top: 2px; right: 7px; font-size: 20px" />';
                if(attrs.iconClick) {
                    html = '<a ng-click="' + attrs.iconClick + '">' + html + '</a>';
                }
                element.append(angular.element(html));
                $('input', element).css("background-color", "rgba(0,0,0,0)");

                if(attrs.iconClick) {
                    $('input', element).css("padding-left", "7px");
                    $('i', element).css("right", "7px");
                } else {
                    $('input', element).css("padding-left", "30px");
                }
            }

            return function($scope, elem, attributes) {
                if(attributes.autofocus && (attributes.autofocus === "true" || attributes.autofocus === true)) {
                    $timeout( function () {
                        $('input', elem)[0].focus();
                    }, 1000);
                }
            };
        }
    };
}]).directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
}).directive('ngCancel', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 27) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngCancel);
                    });

                    event.preventDefault();
                }
            });
        };
}).directive('focusOn',function($timeout) {
    return {
        restrict : 'A',
        link : function($scope, $element, $attr) {
            $scope.$watch($attr.focusOn, function(_focusVal) {
                $timeout(function() {
                    return _focusVal ? $element.focus() : $element.blur();
                });
            });
        }
    };
});
