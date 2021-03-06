﻿angular.module('bridge.employeePicture', []);

angular.module('bridge.employeePicture').directive('bridge.employeePicture', function () {
    return {
        restrict: 'E',
        template: '<img ng-if="employeeUser" style="border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;" valign="top" ng-src="https://avatars.wdf.sap.corp/avatar/{{employeeUser}}?s={{width || 25}}x{{height || 25}}"></img>',
        scope: {
            employeeUser: '@',
            width: '=',
            height: '='
        }
    };
});
