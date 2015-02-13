var IJiraBox = {
        getIssuesforQuery : function() { throw "Not Implemented"; }
};

var JiraBox = function(http){
    this.http = http;
    this.data = [];
};

JiraBox.prototype = Object.create(IJiraBox);

JiraBox.prototype.getIssuesforQuery = function (sQuery, jira_instance, sMaxResults) {
    var that = this;
    var jira_url = 'https://sapjira.wdf.sap.corp:443/rest/api/latest/search?jql=';

    if (!sMaxResults || angular.isNumber(sMaxResults)){
        sMaxResults = "50";
    }
    sMaxResults = "&maxResults=" + sMaxResults;

    if(jira_instance === 'issuemanagement')
    {
      jira_url = 'https://issuemanagement.wdf.sap.corp/rest/api/latest/search?jql=';
    }
    if(jira_instance === 'issues')
    {
      jira_url = 'https://issues.wdf.sap.corp/rest/api/latest/search?jql=';
    }

    if(jira_instance === 'jtrack')
    {
        jira_url = 'https://jtrack.wdf.sap.corp/rest/api/latest/search?jql=';
    }

    return this.http.get(jira_url + sQuery + sMaxResults
        ).success(function (data) {

            that.data.length = 0;

            angular.forEach(data.issues, function(issue) {
              that.data.push({
                key:            issue.key,
                id:             issue.id,
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
                var localGroup = '';

                if (task.parentKey !== null && task.parentKey !== undefined) {
                localGroup += task.parentKey;
                }

                if (task.component !== null && task.component !== undefined) {
                for (var i = 0; i < task.components.length; ++i) {
                  localGroup += task.components[i].id;
                }
                }

                return localGroup;
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

angular.module('app.jira').service('JiraBox', ['$http', function($http) {
  var instances = {};

  this.getInstanceForAppId = function(appId) {
    if(instances[appId] === undefined) {
      instances[appId] = new JiraBox($http);
    }

    return instances[appId];
  };
}]);
