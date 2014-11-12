var app = angular.module('myApp', []);

app.controller('MyCtrl1', ['$scope', '$http', '$window', function($scope, $http, $window) {

  $scope.layouts = [
    { name: '1 x 1', css: 'layout-1by1.css' },
    { name: '2 x 1', css: 'layout-2by1.css' },
    { name: '2 x 2', css: 'layout-2by2.css' }
  ];
  $scope.layout = $scope.layouts[0];

  $scope.layoutSelectionChanged = function() {
    $scope.layoutStylesheet = $scope.layout.css;
  };

  $scope.layoutSelectionChanged();

  //$scope.searchString = 'project = TIPABAPDHP AND issuetype = Task AND labels = ATC AND status = open';
  $scope.searchString = 'id in projectRankedIssues(I2MASEDEV) AND fixVersion in (2013_S24) order by "Project Rank" ASC, Key ASC';

  $scope.descriptionFlag = true;

  $scope.descriptionFlagChanged = function() {
  };

  $scope.statusMessage = 'Waiting for input';

  $scope.printButtonClicked = function() {
    $window.print();
  };

  $scope.fireButtonClicked = function() {
    $scope.statusMessage = 'Accessing JIRA...';

    $http.get('/api/jira?jql=' + encodeURI($scope.searchString)).success(function(data) {
        $scope.tasks = [];

        angular.forEach(data.issues, function(issue) {
          $scope.tasks.push({
            key:            issue.key,
            summary:        issue.fields.summary,
            description:    ($scope.descriptionFlag === true ? issue.fields.description : null),
            components:     issue.fields.components,
            parentKey:      (issue.fields.parent !== undefined ? issue.fields.parent.key : null),
            parentSummary:  (issue.fields.parent !== undefined ? issue.fields.parent.fields.summary : null),
            effortEstimate: issue.fields.customfield_10005
          });
        });

        $scope.tasks.sort(function (a,b) {
          if (a.parentKey < b.parentKey) { return -1; }
          if (a.parentKey > b.parentKey) { return 1; }
          if (a.key < b.key) { return -1; }
          if (a.key > b.key) { return 1; }
          return 0;
        });

        var getGroup = function(task) {
          var localGroup = '';

          if (task.parentKey !== null) {
            localGroup += task.parentKey;
          }

          if (task.component !== null) {
            for (var i = 0; i < task.components.length; ++i) {
              localGroup += task.components[i].id;
            }
          }

          return localGroup;
        };

        var group      = null;
        var colorIndex = 0;
        angular.forEach($scope.tasks, function(task) {
          if (getGroup(task) !== group) {
              ++colorIndex;
              group = getGroup(task);
          }

          task.colorClass = 'taskColor_' + colorIndex;
        });

        $scope.statusMessage = 'Retrieved ' + $scope.tasks.length + ' tasks';
      }).
      error(function() {
        $scope.statusMessage = 'Error accessing JIRA';
      });
  };
}]);
