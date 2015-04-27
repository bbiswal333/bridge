var IJiraBox = {
        getIssuesforQuery : function() { throw "Not Implemented"; }
};

var JiraBox = function(http){
    this.http = http;
    this.data = [];
    this.authenticated = true;
    this.jira_instance = null;
    this.jira_url = 'https://sapjira.wdf.sap.corp:443';
};

JiraBox.prototype = Object.create(IJiraBox);

JiraBox.prototype.setInstance = function(jira_instance) {
  this.jira_instance = jira_instance;

  this.jira_url = 'https://sapjira.wdf.sap.corp:443';

  if(jira_instance === 'issuemanagement')
  {
    this.jira_url = 'https://issuemanagement.wdf.sap.corp';
  }
  if(jira_instance === 'issues')
  {
    this.jira_url = 'https://issues.wdf.sap.corp';
  }

  if(jira_instance === 'jtrack')
  {
      this.jira_url = 'https://jtrack.wdf.sap.corp';
  }

  if(jira_instance === 'successfactors')
  {
    this.jira_url = 'https://jira.successfactors.com:443';
  }
};

JiraBox.prototype.isUserAuthenticated = function () {

  var that = this;

  if(this.jira_instance === 'successfactors'){

    console.log("check if user is authenticated");

    return this.http.get('https://jira.successfactors.com').success(function(data, status, headers, config){
      console.log("Check if user is authenticated and response from jira is:");
      console.log(headers());

          if(status == '401' ||
            $(data).filter("meta[name='ajs-remote-user']").attr("content") === ""){
            that.authenticated = false;
            that.data = [];
            console.log("response: user is not authenticated");
            console.log(headers());
            return;
          }
          console.log("response: user is authenticated");
          that.authenticated = true;
        });
  }

  that.authenticated = true;

  return this.http.get('https://sapjira.wdf.sap.corp:443');
};

JiraBox.prototype.getCreateIssueUrl = function () {
  if(this.jira_instance == 'successfactors'){
    if(this.authenticated){
      return this.jira_url + "/secure/CreateIssue!default.jspa";
    }
    return this.jira_url;
  } else {
    return this.jira_url + "/secure/CreateIssue!default.jspa";
  }
};

JiraBox.prototype.getIssuesforQuery = function (sQuery, sMaxResults) {
    var that = this;

    if (!sMaxResults || angular.isNumber(sMaxResults)){
        sMaxResults = "50";
    }
    sMaxResults = "&maxResults=" + sMaxResults;

    return this.http.get(that.jira_url + "/rest/api/latest/search?jql=" + sQuery + sMaxResults
        ).success(function (data, status, headers, config) {

            that.data.length = 0;

            angular.forEach(data.issues, function(issue) {

              that.data.push({
                key:            issue.key,
                jira_url:       that.jira_url,
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

        }).error(function(data, status, headers, config) {
            that.data = [];
            that.authenticated = true; // in this case don't show login view
        });
};

angular.module('app.jira').service('JiraBox', ['$http', function($http) {
  var instances = {};

  this.getInstanceForAppId = function(appId, jira_instance) {
    if(instances[appId] === undefined) {
      instances[appId] = new JiraBox($http);
    }

    instances[appId].setInstance(jira_instance);

    return instances[appId];
  };
}]);
