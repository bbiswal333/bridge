angular.module('bridge.app')
  .directive('bridge.checkbox', function() {
    return {
      restrict: 'E',
      template: '<label ng-class="{\'checkbox checked\': isChecked, \'checkbox\': !isChecked}" >' +
                  '<span class="icons">' +
                    '<span class="fa-stack">' +
                      '<span class="  fa fa-stop second-icon"></span>' +
                      '<span class="  fa fa-check second-icon fa-inverse "></span>' +
                    '</span>' +
                    '<span class=" fa fa-stop first-icon"></span>' +

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
