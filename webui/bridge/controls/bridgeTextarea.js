angular.module('bridge.app').directive('bridge.textarea', ['$timeout', function ($timeout) {

    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/bridgeTextarea.html',
        replace: true,
        compile: function (element, attrs) {
            // set default type if not given by the directive-definition
            if (_.isUndefined(attrs.type)) {
                attrs.type = "text";
            }

            if (attrs.placeholder) {
                $('textarea', element)[0].setAttribute("placeholder", attrs.placeholder);
            }
            if (attrs.inputTypeaheadAppendToBody) {
                $('textarea', element)[0].setAttribute("typeahead-append-to-body", attrs.inputTypeaheadAppendToBody);
            }
            if (attrs.model) {
                $('textarea', element)[0].setAttribute("ng-model", attrs.model);
            }

            if (attrs.inputTypeahead) {
                $('textarea', element)[0].setAttribute("typeahead", attrs.inputTypeahead);
            }

            if (attrs.inputTypeaheadEditable) {
                $('textarea', element)[0].setAttribute("typeahead-editable", attrs.inputTypeaheadEditable);
            }

            if (attrs.inputTypeaheadOnSelect) {
                $('textarea', element)[0].setAttribute("typeahead-on-select", attrs.inputTypeaheadOnSelect);
            }

            if (attrs.inputTypeaheadTemplateUrl) {
                $('textarea', element)[0].setAttribute("typeahead-template-url", attrs.inputTypeaheadTemplateUrl);
            }

            if (attrs.inputTypeaheadWaitMs) {
                $('textarea', element)[0].setAttribute("typeahead-wait-ms", attrs.inputTypeaheadWaitMs);
            }

            if (attrs.inputTypeaheadMinLength) {
                $('textarea', element)[0].setAttribute("typeahead-min-length", attrs.inputTypeaheadMinLength);
            }

            if (attrs.change) {
                $('textarea', element)[0].setAttribute("ng-change", attrs.change);
            }

            if (attrs.maxlength) {
                $('textarea', element)[0].setAttribute("maxlength", attrs.maxlength);
            }

            if (attrs.focus) {
                $('textarea', element)[0].setAttribute("ng-focus", attrs.focus);
            }

            if (attrs.blur) {
                $('textarea', element)[0].setAttribute("ng-blur", attrs.blur);
            }

            if (attrs.cancel) {
                $('textarea', element)[0].setAttribute("ng-cancel", attrs.cancel);
            }

            if (attrs.id) {
                $('textarea', element)[0].setAttribute("id", attrs.id + "-input");
            }

            if (attrs.required && attrs.required === "true") {
                $('textarea', element)[0].setAttribute("required", "required");
            }

            if(attrs.ngDisabled) {
                $('textarea', element)[0].setAttribute("ng-disabled", attrs.ngDisabled);
            }

            if (attrs.inputFocusOn) {
                $('textarea', element)[0].setAttribute("focus-on", attrs.inputFocusOn);
            }

            if (attrs.ngRequired) {
                $('textarea', element)[0].setAttribute("ng-required", attrs.ngRequired);
            }

            if (attrs.ngKeypress) {
                $('textarea', element)[0].setAttribute("ng-keypress", attrs.ngKeypress);
            }

            if (attrs.enter) {
                $('textarea', element)[0].setAttribute("ng-enter", attrs.enter);
            }

            if (attrs.icon) {
                element.append(angular.element('<i class="fa ' + attrs.icon + '" style="position: absolute; top: 0px; left: 7px; font-size: 20px" />'));
                $('textarea', element).css("background-color", "rgba(0,0,0,0)");
                $('textarea', element).css("padding-left", "30px");
            }

            return function ($scope, elem, attributes) {
                if (attributes.autofocus && (attributes.autofocus === "true" || attributes.autofocus === true)) {
                    $timeout(function () {
                        $('textarea', elem)[0].focus();
                    }, 1000);
                }
            };
        }
    };
}]).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}).directive('ngCancel', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 27) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngCancel);
                });

                event.preventDefault();
            }
        });
    };
}).directive('focusOn', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            $scope.$watch($attr.focusOn, function (_focusVal) {
                $timeout(function () {
                    return _focusVal ? $element.focus() : $element.blur();
                });
            });
        }
    };
});
