'use strict';

var dashboardBox = angular.module('dashboardBox', ['atcServices', 'googlechart', 'ui.bootstrap']);

dashboardBox.controller('Controller', ['$scope', '$http', function Controller($scope, $http) {
    $http.defaults.headers.common['X-Requested-With'] = undefined;
}]);
