var IJiraBox = {
        getIssuesforQuery : function() { throw "Not Implemented"; }
};

var JiraBox = function(http){
    this.http = http;
    this.data = [];
    this.authenticated = true;
};

JiraBox.prototype = Object.create(IJiraBox);

JiraBox.prototype.login = function (username, pwd) {

    console.log("login");

  var req = {
   method: 'GET',
   url: 'https://jira-staging.successfactors.com:443',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': 'Basic ' + window.btoa(username+':'+pwd),
   },
  };

  return this.http(req);
};

JiraBox.prototype.isUserAuthenticated = function (jira_instance) {

  var that = this;

  if(jira_instance === 'successfactors'){

    console.log("check if user is authenticated");

    return this.http.get('https://jira-staging.successfactors.com').success(function(data, status, headers, config){

          if((headers()['x-ausername'] == 'anonymous') ||
            (headers()['X-AUSERNAME'] == 'anonymous') ||
            status == '401'){
            that.authenticated = false;
            that.data = [];
            console.log("response: user is not authenticated");
            return;
          }
          console.log(headers());
          console.log("response: user is authenticated");
          that.authenticated = true;
        });
  }

  that.authenticated = true;

  return this.http.get('https://sapjira.wdf.sap.corp:443');
};

JiraBox.prototype.getCreateIssueUrl = function (jira_instance) {
  if(jira_instance == 'successfactors'){
    if(this.authenticated){
      return "https://jira.successfactors.com/secure/CreateIssue!default.jspa";
    }
    return "https://jira.successfactors.com";
  } else {
    return "https://sapjira.wdf.sap.corp/secure/CreateIssue!default.jspa";
  }
};

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

    if(jira_instance === 'successfactors')
    {
      jira_url = 'https://jira-staging.successfactors.com:443/rest/api/latest/search?jql=';
    }

    console.log("fire query: " + jira_url + sQuery + sMaxResults);

    return this.http.get(jira_url + sQuery + sMaxResults
        ).success(function (data, status, headers, config) {

          console.log("response from server: ");
          console.log(headers());

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

        }).error(function(data, status, headers, config) {
            that.data = [];
            that.authenticated = true; // in this case don't show login view
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
