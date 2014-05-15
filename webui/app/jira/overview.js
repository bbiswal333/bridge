angular.module('app.jira', []);

angular.module('app.jira').factory("app.jira.configservice", function () 
{  
    var data = {};
    data.query = 'id in projectRankedIssues(I2MASEDEV) AND status != "Accepted" AND status != "Blocked" order by "Project Rank" ASC, Key ASC';
    return data;
});

angular.module('app.jira').directive('app.jira', ['app.jira.configservice', function (JiraConfig) {

    var directiveController = ['$scope', 'JiraBox', 'bridgeCounter', function ($scope, JiraBox, bridgeCounter) {        
        $scope.box.boxSize = "2";
        $scope.box.settingsTitle = "Configure JIRA Query";
        $scope.box.settingScreenData = {
            templatePath: "jira/settings.html",
                controller: angular.module('app.jira').appJiraSettings,
                id: $scope.boxId,
        };    

        $scope.data = {};
        $scope.data.exampleData = [
            { key: "Open", y: 6 },
            { key: "In Progess", y: 4 },
            { key: "Completed", y: 7 }            
        ];    

        $scope.xFunction = function(){
            return function(d) {
                return d.key;
            };
        }   

        $scope.yFunction = function(){
            return function(d){
                return d.y;
            };  
        }

        //copied from the cats allocation bar
        var colors = [
            "#3399cc",
            "#6cb9e3",
            "#a4d8f9",
            "#c4e8ff",
            "#dff5ff",
            "#Fff7e1",
            "#ffe9b8",
            "#ffd07e",
            "#ffb541",
            "#ffa317"
        ];

        $scope.colorFunction = function() {
            return function(d, i) {
                return colors[i];
            };
        }

        $scope.box.returnConfig = function(){
            return JiraConfig;
        }

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/jira/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            if ($scope.appConfig !== undefined && $scope.appConfig.query !== undefined) {
                JiraConfig.query = $scope.appConfig.query;
            }
        }
    };
}]);
