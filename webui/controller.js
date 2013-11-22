'use strict';

/* Controllers */

var dashboardBox = angular.module('dashboardBox', ['atcServices', 'googlechart']);

dashboardBox.controller('Controller', ['$scope', '$http', 'ATCDataProvider', 'Config', 'FindEmployee', function Controller($scope, $http, ATCDataProvider, Config, FindEmployee) {
    $http.defaults.headers.common['X-Requested-With'] = undefined;

    ATCDataProvider.getResultForConfig(Config, $scope);
    $scope.$watch('atcData', function () { updateATCChart($scope); });

    //$scope.users = [];

    //FindEmployee.query(function (response) {
    //    $scope.users = response['DATA'];
    //});

    //$scope.dosearch = function () {
    //    if (!$scope.search) $scope.search = "";
    //    FindEmployee.query({ search: $scope.search }, function (response) {

    //        $scope.users = response['DATA'];
    //    });
    //};
}]);

var updateATCChart = function ($scope) {
    var chart1 = {};
    chart1.type = "PieChart";
    chart1.displayed = true;
    chart1.cssStyle = "height:600px; width:100%;";
    chart1.data = {
        "cols": [
            { id: "month", label: "Month", type: "string" },
            { id: "laptop-id", label: "Laptop", type: "number" },
        ], "rows": [
            {
                c: [
                   { v: "Prio 1" },
                   { v: $scope.atcData.prio1, f: $scope.atcData.prio1 + " Prio 1 messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 2" },
                   { v: $scope.atcData.prio2, f: $scope.atcData.prio2 + " Prio 2 messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 3" },
                   { v: $scope.atcData.prio3 }
                ]
            },
            {
                c: [
                   { v: "Prio 4" },
                   { v: $scope.atcData.prio4 }
                ]
            }
        ]
    };

    chart1.options = {
        "title": "ATC Errors",
        "sliceVisibilityThreshold": 0,
        "colors": ['red','orange', 'yellow', 'blue'],
        "pieHole": 0.6,
        "fill": 20,
        "displayExactValues": true
    };

    chart1.formatters = {};

    $scope.chart = chart1;
}