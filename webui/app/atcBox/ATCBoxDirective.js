bridgeApp.directive('atcbox', function () {

    var directiveController = ['$scope', '$modal', 'ATCDataProvider', 'Config', 'atcData', function ($scope, $modal, ATCDataProvider, Config, atcData) {
        $scope.boxTitle = "ABAP Code Check Results";
        $scope.boxIcon = '&#xe05e;';

        $scope.settings = {
            templatePath: "atcBox/ATCBoxSettingsTemplate.html",
            controller: {},
            id: $scope.boxId,
        };

        $scope.atcData = atcData;

        $scope.loadData = function () {
            ATCDataProvider.getResultForConfig(Config, atcData);
        }

        $scope.$watch('atcData.data', function () { 
            $scope.updateATCChart($scope);
            $scope.initialized = true;
        });

        $scope.updateATCChart = function ($scope) {
            var chart1 = {};
            chart1.type = "PieChart";
            chart1.displayed = true;
            chart1.cssStyle = "height:150px; width:100%;";
            chart1.data = {
                "cols": [
                    { id: "month", label: "Month", type: "string" },
                    { id: "laptop-id", label: "Laptop", type: "number" },
                ], "rows": [
                    {
                        c: [
                           { v: "Prio 1 (" + $scope.atcData.data.prio1 + ")" },
                           { v: $scope.atcData.data.prio1, f: $scope.atcData.data.prio1 + " Prio 1 messages" }
                        ]
                    },
                    {
                        c: [
                           { v: "Prio 2 (" + $scope.atcData.data.prio2 + ")" },
                           { v: $scope.atcData.data.prio2, f: $scope.atcData.data.prio2 + " Prio 2 messages" }
                        ]
                    },
                    {
                        c: [
                           { v: "Prio 3 (" + $scope.atcData.data.prio3 + ")" },
                           { v: $scope.atcData.data.prio3 }
                        ]
                    },
                    {
                        c: [
                           { v: "Prio 4 (" + $scope.atcData.data.prio4 + ")" },
                           { v: $scope.atcData.data.prio4 }
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
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/atcBox/ATCBoxDirective.html',
        controller: directiveController
    };

});