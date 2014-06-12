﻿angular.module('app.jira', []);

angular.module('app.jira').factory("app.jira.configservice", function () 
{  
    var data = {};
    data.query = 'assignee = currentUser()';
    return data;
});

angular.module('app.jira').directive('app.jira', ['app.jira.configservice', 'JiraBox', function (JiraConfig, JiraBox) {

    var directiveController = ['$scope', 'JiraBox', function ($scope, JiraBox) {        
        $scope.box.boxSize = "2";
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

 
        //copied from the cats allocation bar
        $scope.colors = [
            "#428BCA",
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
            $scope.totalCount = 0;
            for (var attribute in jiraStatus) {
                if (jiraStatus.hasOwnProperty(attribute)) 
                {                    
                    $scope.totalCount = $scope.totalCount + jiraStatus[attribute];
                    $scope.data.jiraChart.push({"status" : attribute, "count" : jiraStatus[attribute], "status_filter" : attribute});
                }
            }        

            $scope.data.jiraChart.sort(function(item1, item2){
                if(item1.count < item2.count) return 1;
                if(item1.count > item2.count) return -1;
                return 0;
            });

            if( $scope.data.jiraChart.length > 4)
            {                
                var others_count = 0;
                var others_filter = '';
                for(var i = 4; i < $scope.data.jiraChart.length; i++)
                {
                    others_count = others_count + $scope.data.jiraChart[i].count;
                    if(others_filter == "")
                    {
                        others_filter = $scope.data.jiraChart[i].status;
                    }
                    else
                    {
                        others_filter = others_filter + '|' + $scope.data.jiraChart[i].status;
                    }
                }
                $scope.data.jiraChart.splice(4, $scope.data.jiraChart.length-4);
                $scope.data.jiraChart.push({"status" : "Others", "count" : others_count, "status_filter": others_filter});
            }                        
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
