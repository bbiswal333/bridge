bridgeApp.directive('atcbox', function () {

    var directiveController = ['$scope', '$modal', 'ATCDataProvider', 'Config', function ($scope, $modal, ATCDataProvider, Config) {
        ATCDataProvider.getResultForConfig(Config, $scope);
        $scope.$watch('atcData', function () { updateATCChart($scope); });
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/atcBox/ATCBoxDirective.html',
        controller: directiveController
    };
});

var updateATCChart = function ($scope) {
    var chart1 = {};
    chart1.type = "PieChart";
    chart1.displayed = true;
    chart1.cssStyle = "height:105px; width:100%;";
    chart1.data = {
        "cols": [
            { id: "month", label: "Month", type: "string" },
            { id: "laptop-id", label: "Laptop", type: "number" },
        ], "rows": [
            {
                c: [
                   { v: "Prio 1 (" + $scope.atcData.prio1 + ")" },
                   { v: $scope.atcData.prio1, f: $scope.atcData.prio1 + " Prio 1 messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 2 (" + $scope.atcData.prio2 + ")" },
                   { v: $scope.atcData.prio2, f: $scope.atcData.prio2 + " Prio 2 messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 3 (" + $scope.atcData.prio3 + ")" },
                   { v: $scope.atcData.prio3 }
                ]
            },
            {
                c: [
                   { v: "Prio 4 (" + $scope.atcData.prio4 + ")" },
                   { v: $scope.atcData.prio4 }
                ]
            }
        ]
    };

    chart1.options = {
        "title": "",
        "sliceVisibilityThreshold": 0,
        "colors": ['#097AC5', '#5CCCFF', '#AFE5FF', '#E6F7FF'],
        "pieHole": 0.75,
        "fill": 20,
        "displayExactValues": false
    };

    chart1.formatters = {};

    $scope.chart = chart1;
}