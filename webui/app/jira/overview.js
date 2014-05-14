angular.module('app.jira', []);

angular.module('app.jira').factory("app.jira.configservice", function () 
{  
    var data = {};
    data.query = 'id in projectRankedIssues(I2MASEDEV) AND status != "Accepted" AND status != "Blocked" order by "Project Rank" ASC, Key ASC';
    return data;
});

angular.module('app.jira').directive('app.jira', ['app.jira.configservice', function (JiraConfig) {

    var directiveController = ['$scope', 'JiraBox', 'bridgeCounter', function ($scope, JiraBox, bridgeCounter) {        
        $scope.boxSize = "2";
        $scope.settingsTitle = "Configure JIRA Query";
        $scope.settingScreenData = {
            templatePath: "jira/settings.html",
                controller: angular.module('app.jira').appJiraSettings,
                id: $scope.boxId,
        };        

        $scope.returnConfig = function(){
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
