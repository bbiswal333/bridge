var IJiraBox = {
        getIssuesforQuery : function() { throw "Not Implemented"; }
};

var JiraBox = function(http){
    this.http = http;
    this.data = [];
    this.isInitialized = false;
};

JiraBox.prototype = Object.create(IJiraBox);

JiraBox.prototype.getIssuesforQuery = function (sQuery, jira_instance) {
    var that = this;
    var jira_url = 'https://sapjira.wdf.sap.corp:443/rest/api/latest/search?jql=';
    
    if(jira_instance === 'issuemanagement')
    {
      jira_url = 'https://issuemanagement.wdf.sap.corp/rest/api/latest/search?jql=';
    }

    // https://jtrack/rest/api/latest/search?jql=
    if(jira_instance === 'jtrack')
    {
        jira_url = 'https://jtrack.wdf.sap.corp/rest/api/latest/search?jql=';
        // jira_url = window.client.origin + '/api/get?proxy=true&url=' + encodeURI(jira_url);
    }

    this.http.get(jira_url + sQuery
        ).success(function (data) {

            that.data.length = 0;        

            angular.forEach(data.issues, function(issue) {
              that.data.push({
                key:            issue.key,
                summary:        issue.fields.summary,
                description:    issue.fields.description,
                components:     issue.fields.components,
                parentKey:      (issue.fields.parent !== undefined ? issue.fields.parent.key : null),
                parentSummary:  (issue.fields.parent !== undefined ? issue.fields.parent.fields.summary : null),
                effortEstimate: issue.fields.customfield_10005,
                status:         issue.fields.status.name
              });   
            });

            that.data.sort(function (a,b) {
              if (a.parentKey < b.parentKey) { return -1; }
              if (a.parentKey > b.parentKey) { return 1; }
              if (a.key < b.key) { return -1; }
              if (a.key > b.key) { return 1; }
              return 0;
            });

            var getGroup = function(task) {
              var group = '';

              if (task.parentKey !== null && task.parentKey !== undefined) {
                group += task.parentKey;
              }

              if (task.component !== null && task.component !== undefined) {
                for (var i = 0; i < task.components.length; ++i) {
                  group += task.components[i].id;
                }
              }

              return group;
            };

            var group      = null;
            var colorIndex = 0;
            angular.forEach(that.data, function(task) {
              if (getGroup(task) !== group) {
                  ++colorIndex;
                  group = getGroup(task);
              }

              task.colorClass = 'taskColor_' + colorIndex;
            });                                                                

        }).error(function() {
            that.data = [];
        });        
};

angular.module('app.jira').factory('JiraBox', ['$http',
   function ($http) {
       return new JiraBox($http);
   }]);
