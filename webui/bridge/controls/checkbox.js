angular.module('bridge.app')
  .directive('bridge.checkbox', function() {
    return {
      restrict: 'E',
      template: '<label ng-class="{\'checkbox checked\': isChecked, \'checkbox\': !isChecked}" >' + 
                  '<span class="icons">' + 
                    '<span class="first-icon fa fa-square"></span>' +
                    '<span class="second-icon fa fa-check-square"></span>' +
                  '</span>' +
                  '<input type="checkbox" ng-click="isChecked = !isChecked">' + 
                  '<span class="content">' + 
                    '<span class="unchecked-content">{{uncheckedLabel}}</span>' +
                    '<span class="checked-content">{{checkedLabel}}</span>' +
                '</span>' +
              '</label>',
      scope: {
            checkedLabel: '@',
            uncheckedLabel: '@',
            isChecked: '@'
      }
    };
});
