bridgeApp.directive('jirabox', function () {

    var directiveController = ['$scope', 'JiraBox', 'JiraQuery', function ($scope, JiraBox, JiraQuery) {
	
        JiraBox.getIssuesforQuery(JiraQuery, $scope);
        $scope.$watch('jiraData', function () { updateJiraChart($scope); });

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/jiraBox/JiraBoxDirective.html',
        controller: directiveController
    };
});


var updateJiraChart = function ($scope) {
    var chart1 = {};
    chart1.type = "PieChart";
    chart1.displayed = true;
    chart1.cssStyle = "height:105px; width:100%;";
    chart1.data = {
        "cols": [
            { id: "month", label: "Month", type: "string" },
            { id: "laptop-id", label: "Laptop", type: "number" },
        ], "rows": [
            /*{
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
            }*/
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

    $scope.jiraChart = chart1;
}