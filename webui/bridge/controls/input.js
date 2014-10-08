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

            if(attrs.id) {
                $('input', element)[0].setAttribute("id", attrs.id);
            }

            if(attrs.required && attrs.required === "true") {
                $('input', element)[0].setAttribute("required", "required");
            }

            if(attrs.ngDisabled) {
                $('input', element)[0].setAttribute("ng-disabled", attrs.ngDisabled);
            }

            if(attrs.ngRequired) {
                $('input', element)[0].setAttribute("ng-required", attrs.ngRequired);
            }

            if(attrs.ngKeypress) {
                $('input', element)[0].setAttribute("ng-keypress", attrs.ngKeypress);
            }

            if(attrs.icon) {
                element.append(angular.element('<i class="fa ' + attrs.icon + '" style="position: absolute; top: 0px; left: 7px; font-size: 20px" />'));
                $('input', element).css("background-color", "rgba(0,0,0,0)");
                $('input', element).css("padding-left", "30px");
            }

            return function($scope, element, attrs) {
                if(attrs.autofocus && attrs.autofocus === "true") {
                    $timeout( function () { $('input', element)[0].focus(); } );
                }
            };
        }
    };
}]);
