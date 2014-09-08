angular.module('bridge.app')
  .directive('bridge.radio', function() {
    return {
      restrict: 'E',
      template: '<label ng-class="{\'radio checked\': isChecked, \'radio\': !isChecked}">' +
                  '<span class="icons">' +
                    '<span class="first-icon fa fa-circle-o"></span>' +
                    '<span class="second-icon fa fa-dot-circle-o"></span>' +
                  '</span>' +
                  '<input type="radio" ng-click="isChecked = !isChecked">' +
                  '<span class="content">' +
                    '<span class="checked-content">{{radioLabel}}</span>' +
                '</span>' +
              '</label>',
      scope: {
            radioLabel: '@',
            isChecked: '@'
      }
    };
  });
