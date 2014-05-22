angular.module('app.jira', []);

angular.module('app.jira').factory("app.jira.configservice", function () 
{  
    var data = {};
    data.query = 'id in projectRankedIssues(I2MASEDEV) AND status != "Accepted" AND status != "Blocked" order by "Project Rank" ASC, Key ASC';
    return data;
});

angular.module('app.jira').directive('app.jira', ['app.jira.configservice', 'JiraBox', function (JiraConfig, JiraBox) {

    var directiveController = ['$scope', 'JiraBox', 'bridgeCounter', function ($scope, JiraBox, bridgeCounter) {        
        $scope.box.boxSize = "1";
        $scope.box.settingsTitle = "Configure JIRA Query";
        $scope.box.settingScreenData = {
            templatePath: "jira/settings.html",
                controller: angular.module('app.jira').appJiraSettings,
                id: $scope.boxId,
        };  

        $scope.data = {};
        $scope.data.jiraData = [];
        $scope.data.jiraChart = [];

        $scope.config = {};        

        $scope.xFunction = function(){
            return function(issue) {
                return issue.status;
            };
        }   

        $scope.yFunction = function(){
            return function(issue){
                return issue.count;
            };  
        }

        $scope.toolTipContentFunction = function(){
            return function(key, x, y) {
            return  '<p class="chart_toolTip">' +  x +'</p>'
    }
}
        //copied from the cats allocation bar
        $scope.colors = [
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
                return $scope.colors[i];
            };
        }

        $scope.box.returnConfig = function(){
            return JiraConfig;
        }

        $scope.$watch('config', function() {            
            JiraBox.getIssuesforQuery($scope);            
        },true);    

        $scope.$watch('data.jiraData', function() {

            var jiraStatus = {};
            for(var i = 0; i < $scope.data.jiraData.length; i++)
            {
                if(!jiraStatus[$scope.data.jiraData[i].status])
                {
                    jiraStatus[$scope.data.jiraData[i].status] = 1
                }
                else
                {
                    jiraStatus[$scope.data.jiraData[i].status] = jiraStatus[$scope.data.jiraData[i].status] + 1;   
                }            
            }        

            $scope.data.jiraChart = [];
            for (var attribute in jiraStatus) {
                if (jiraStatus.hasOwnProperty(attribute)) 
                {                    
                    $scope.data.jiraChart.push({"status" : attribute, "count" : jiraStatus[attribute]});
                }
            }        

            $scope.data.jiraChart.sort(function(item1, item2){
                if(item1.count < item2.count) return 1;
                if(item1.count > item2.count) return -1;
                return 0;
            });

            if( $scope.data.jiraChart.length > 3)
            {
                var others_count = 0;
                for(var i = 3; i < $scope.data.jiraChart.length; i++)
                {
                    others_count = others_count + $scope.data.jiraChart[i].count;
                }
                $scope.data.jiraChart.splice(3, $scope.data.jiraChart.length-3);
                $scope.data.jiraChart.push({"status" : "Others", "count" : others_count});
            }

            console.log($scope.data.jiraChart);
        },true);    

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/jira/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            if ($scope.appConfig !== undefined && $scope.appConfig != {} && $scope.appConfig.query !== undefined) 
            {
                JiraConfig.query = $scope.appConfig.query;
            }
            $scope.config = JiraConfig;                        
        }
    };
}]);
