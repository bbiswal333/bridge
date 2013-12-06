dashboardBox.directive('atcbox', function () {

    var directiveController = ['$scope', '$modal', 'ATCDataProvider', 'Config', function ($scope, $modal, ATCDataProvider, Config) {
        ATCDataProvider.getResultForConfig(Config, $scope);
        $scope.$watch('atcData', function () { updateATCChart($scope); });

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.detailsClick = function () {
            var modalInstance = $modal.open({
                templateUrl: 'Boxes/ATC/ATCDetails.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                // ok pressed - modal.close()
                $scope.selected = selectedItem;
            }, function () {
                // cancel pressed - modal.dismiss
                var a = 1;
            });
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'Boxes/ATC/ATCDirective.html',
        controller: directiveController
    };
});

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var updateATCChart = function ($scope) {
    var chart1 = {};
    chart1.type = "PieChart";
    chart1.displayed = true;
    chart1.cssStyle = "height:150px; width:200px;";
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
        "colors": ['red', 'orange', 'yellow', 'blue'],
        "pieHole": 0.6,
        "fill": 20,
        "displayExactValues": true
    };

    chart1.formatters = {};

    $scope.chart = chart1;
}