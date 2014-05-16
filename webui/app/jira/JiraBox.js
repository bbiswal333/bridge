var IJiraBox = {
        getIssuesforQuery : function(query) { throw "Not Implemented"; },
};

var JiraBox = function(http){
    this.http = http;
};

JiraBox.prototype = Object.create(IJiraBox);

JiraBox.prototype.getIssuesforQuery = function (scope) {    
    this.http.get('https://sapjira.wdf.sap.corp:443/rest/api/latest/search?jql=' + scope.config.query
        ).success(function(data, status, headers, config) {
            if(!scope.data) scope.data = {};
            scope.data.jiraData = [];        

            angular.forEach(data.issues, function(issue) {
              scope.data.jiraData.push({
                key:            issue.key,
                summary:        issue.fields.summary,
                description:    issue.fields.description,
                components:     issue.fields.components,
                parentKey:      (issue.fields.parent !== undefined ? issue.fields.parent.key : null),
                parentSummary:  (issue.fields.parent !== undefined ? issue.fields.parent.fields.summary : null),
                effortEstimate: issue.fields.customfield_10005,
                status:         issue.fields.status.name, 
              });   
            });

            scope.data.jiraData.sort(function (a,b) {
              if (a.parentKey < b.parentKey) return -1;
              if (a.parentKey > b.parentKey) return 1;
              if (a.key < b.key) return -1;
              if (a.key > b.key) return 1;
              return 0;
            });

            var getGroup = function(task) {
              var group = '';

              if (task.parentKey !== null) {
                group += task.parentKey;
              }

              if (task.component !== null) {
                for (var i = 0; i < task.components.length; ++i) {
                  group += task.components[i].id;
                }
              }

              return group;
            };

            var group      = null;
            var colorIndex = 0;
            angular.forEach(scope.data.jiraData, function(task) {
              if (getGroup(task) != group) {
                  ++colorIndex;
                  group = getGroup(task);
              }

              task.colorClass = 'taskColor_' + colorIndex;
            });                        

        }).error(function(data, status, headers, config) {
            console.log(status);
            console.log(data);
            scope.jiraData = [];                        
        });        
};

angular.module('app.jira').factory('JiraBox', ['$http',
   function ($http) {
       return new JiraBox($http);
   }]);