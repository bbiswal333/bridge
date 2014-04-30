angular.module('app.jira', []);

angular.module('app.jira').directive('app.jira', ['app.jira.configservice', function (JiraConfig) {

    var directiveController = ['$scope', 'JiraBox', 'bridgeCounter', function ($scope, JiraBox, bridgeCounter) {
        $scope.boxTitle = "Jira";
        $scope.boxIcon = '&#xe80a;';
        $scope.boxIconClass = 'icon-bell';
        $scope.boxSize = "2";
        bridgeCounter.CollectWebStats('JIRA', 'APPLOAD');

        $scope.settingsTitle = "Configure JIRA Query";
        $scope.settingScreenData = {
            templatePath: "jira/settings.html",
                controller: angular.module('app.jira').appJiraSettings,
                id: $scope.boxId,
        };

        //JiraBox.getIssuesforQuery(JiraQuery, $scope);
        $scope.$watch('jiraData', function () {
            updateJiraChart($scope);
        });

        $scope.returnConfig = function(){
            return JiraConfig.query;
        }

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/jira/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            if ($scope.appConfig != undefined) {
                JiraConfig.query = $scope.appConfig;
            }
        }
    };
}]);


var updateJiraChart = function ($scope) {
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
                   { v: "Open (5)" },
                   { v: 5, f: "5 Issues Open" }
                ]
            },
            {
                c: [
                   { v: "In Prog.(4)" },
                   { v: 4, f: "4 Issues In Progress" }
                ]
            },
            {
                c: [
                   { v: "Compl. (2)" },
                   { v: 2, f: "2 Issues Completed" }
                ]
            }
    ]};
    

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
