/**
 * Created by D062081 on 13.08.2014.
 */

(function () {
    "use strict";
})();

/* Directives */

//angular.module("app.sirius", []);

angular.module('app.sirius.siriusDirectives', [])
    .directive('multiselectDropdown', function () {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                options: '=',
                text: '=',
                sort: '@',
                isFilter: '=',
                displayAttribute: '@'
            },
            template: "<div class='btn-group'>" +
                "<button class='btn btn-default dropdown-toggle' data-toggle='dropdown' ng-click='toggleDropdown()'><i class='fa fa-filter' ng-show='isFilter' style='margin-right:5px;'></i>{{text}}" +
                "<span class='caret' style='margin-left:10px;'>" +
                "</span>" +
                "</button>" +
                "<ul class='dropdown-menu' sirius-hide-on-mouse-out-multiselect='open'>" +
                "<li ng-click='selectAll()'><a style='display:inline'>Check All</a></li>" +
                "<li ng-click='deselectAll();'><a style='display:inline'>Uncheck All</a></li>" +
                "<li class='divider' ng-if='showDivider'></li>" +
                "<li ng-repeat='option in options' ng-class='{selected: isChecked(option)}' ng-click='selectItem($event)'><a unselectable='on' ng-class='{bold: getDisplayText(option) == \"me\"}'>{{getDisplayText(option)}}</a></li>" +
                "</ul>" +
                "</div>",
            controller: function ($scope) {
                $scope.showDivider = false;

                var _sortFunction = function (a, b) {
                    // Sort the entries in alphabetical order with "me" always at the top
                    if ((a[$scope.displayAttribute] === 'me') !== (b[$scope.displayAttribute] === 'me')) {
                        return a[$scope.displayAttribute] === 'me' ? -1 : 1;
                    }
                    return a[$scope.displayAttribute] > b[$scope.displayAttribute] ? 1 : a[$scope.displayAttribute] < b[$scope.displayAttribute] ? -1 : 0;
                };
                $scope.toggleDropdown = function () {
                };

                $scope.$watch('options', function () {
                    if ($scope.sort) {
                        $scope.options.sort(_sortFunction);
                    }
                    $scope.showDivider = $scope.options.length > 0;
                }, true);

                $scope.selectAll = function () {
                    // Copy everything from the options to the model
                    if ($scope.options instanceof Array && $scope.model instanceof Array) {
                        $scope.options.forEach(function (value) {
                            var addToModel = true;
                            var tmpVal;
                            $scope.model.forEach(function (model) {
                                model = model.id || model;
                                tmpVal = value.id || value;
                                if (model === tmpVal) {
                                    addToModel = false;
                                }
                            });
                            if (addToModel) {
                                $scope.model.push(value);
                            }
                            /*if (!_.contains($scope.model,value)) {
                             $scope.model.push(value);
                             }*/
                        });
                    }
                };

                $scope.deselectAll = function () {
                    // Reset all entries in the model
                    _.remove($scope.model, function () {
                        return true;
                    });
                };

                $scope.selectItem = function (event) {
                    event.stopPropagation();
                    var self = this;
                    var addToModel = true;
                    var tmpVal;
                    $scope.model.forEach(function (model) {
                        model = model.id || model;
                        tmpVal = self.option.id || self.option;
                        if (model === tmpVal) {
                            addToModel = false;
                        }
                    });

                    if (addToModel) {
                        $scope.model.push(this.option);
                        $scope.model.sort(_sortFunction);
                    }
                    else {
                        //get index
                        var index = 0;
                        $scope.model.forEach(function (model, i) {
                            model = model.id || model;
                            tmpVal = self.option.id || self.option;
                            if (model === tmpVal) {
                                index = i;
                            }
                        });
                        $scope.model.splice(index, 1);
                    }

                    /*if (_.contains($scope.model, this.option)) {
                     $scope.model.splice($scope.model.indexOf(this.option), 1);
                     } else {
                     $scope.model.push(this.option);
                     $scope.model.sort(_sortFunction);
                     }*/
                    return false;
                };

                $scope.isChecked = function (id) {
                    return _.contains($scope.model, id);
                };

                $scope.checkDisabled = function () {
                    return $scope.options.length < 1;
                };

                $scope.getDisplayText = function (value) {
                    // Returns the "displayAttribute" of the value, if it is there, or the value itself
                    if (typeof value === 'object' && $scope.displayAttribute && value.hasOwnProperty($scope.displayAttribute)) {
                        return value[$scope.displayAttribute];
                    }
                    else {
                        return value;
                    }
                };
            }
        };
    });
