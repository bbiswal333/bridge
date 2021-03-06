﻿angular.module('app.jira', []);

angular.module('app.jira').service("app.jira.configservice", ["bridgeDataService", function (bridgeDataService){
    var instances = {};

    var Config = (function () {
        return function() {
            var isInitialized = false;
            var config = {
                query: 'assignee = currentUser()',
                jira: 'sapjira',
                maxHits: '50'
            };

            this.initialize = function (sAppId) {
                var persistedConfig = bridgeDataService.getAppConfigById(sAppId);

                if (persistedConfig !== undefined && persistedConfig !== {} && persistedConfig.query !== undefined) {
                    config.query = persistedConfig.query;
                    if(persistedConfig.jira !== undefined)
                    {
                        config.jira = persistedConfig.jira;
                    }
                    config.maxHits = persistedConfig.maxHits;
                }

                isInitialized = true;
            };

            this.isInitialized = function() {
                return isInitialized;
            };

            this.getConfig = function() {
                return config;
            };
        };
    })();

    this.getConfigInstanceForAppId = function(appId) {
        if(instances[appId] === undefined) {
            instances[appId] = new Config();
            bridgeDataService.getAppById(appId).returnConfig = function() {
                return instances[appId].getConfig();
            };
        }
        return instances[appId];
    };
}]);

angular.module('app.jira').directive('app.jira', ['app.jira.configservice', 'JiraBox', '$window', function (JiraConfig, JiraBox, $window) {

    var directiveController = ['$scope', function ($scope) {
        var config = JiraConfig.getConfigInstanceForAppId($scope.metadata.guid);
        var jiraBox = JiraBox.getInstanceForAppId($scope.metadata.guid, config.getConfig().jira);

        $scope.box.boxSize = "2";
        $scope.box.settingsTitle = "Configure JIRA Query";
        $scope.box.settingScreenData = {
            templatePath: "jira/settings.html",
                controller: angular.module('app.jira').appJiraSettings,
                id: $scope.boxId
        };

        $scope.box.headerIcons = [{
            iconCss: "fa-plus",
            title: "Create Issue",
            callback: function(){
                $window.open(jiraBox.getCreateIssueUrl());
            }
        }];

        $scope.jiraData = jiraBox.data;
        $scope.authenticated = jiraBox.authenticated;
        $scope.jira_url = jiraBox.jira_url;
        $scope.jiraChartData = [];

        $scope.config = {};

        //copied from the cats allocation bar
        $scope.colors = [
            "#418AC9",
            "#68A1D4",
            "##8EB9DF",
            "#B3D0E9",
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
        };

        $scope.$watch('config', function (newVal, oldVal) {
            if (newVal !== oldVal) { // this avoids the call of our change listener for the initial watch setup

                jiraBox.setInstance(config.getConfig().jira);
                $scope.jira_url = jiraBox.jira_url;

                jiraBox.isUserAuthenticated().then(function() {
                    $scope.authenticated = jiraBox.authenticated;

                    if(jiraBox.authenticated){
                        jiraBox.getIssuesforQuery(config.getConfig().query, config.getConfig().maxHits).then(function() {
                            $scope.jiraData = jiraBox.data;
                        });
                    }
                });
            }
        },true);

        $scope.$watch('jiraData', function () {

            var jiraStatus = {};
            var i = 0;
            for (i = 0; i < $scope.jiraData.length; i++)
            {
                if (!jiraStatus[$scope.jiraData[i].status])
                {
                    jiraStatus[$scope.jiraData[i].status] = 1;
                }
                else
                {
                    jiraStatus[$scope.jiraData[i].status] = jiraStatus[$scope.jiraData[i].status] + 1;
                }
            }

            $scope.jiraChartData = [];
            $scope.totalCount = 0;
            for (var attribute in jiraStatus) {
                if (jiraStatus.hasOwnProperty(attribute))
                {
                    $scope.totalCount = $scope.totalCount + jiraStatus[attribute];
                    $scope.jiraChartData.push({ "status": attribute, "count": jiraStatus[attribute], "status_filter": attribute });
                }
            }

            $scope.jiraChartData.sort(function (item1, item2) {
                if(item1.count < item2.count) {
                    return 1;
                }
                if(item1.count > item2.count) {
                    return -1;
                }
                return 0;
            });

            if ($scope.jiraChartData.length > 4)
            {
                var others_count = 0;
                var others_filter = '';
                for (i = 4; i < $scope.jiraChartData.length; i++)
                {
                    others_count = others_count + $scope.jiraChartData[i].count;
                    if(others_filter === "")
                    {
                        others_filter = $scope.jiraChartData[i].status;
                    }
                    else
                    {
                        others_filter = others_filter + '|' + $scope.jiraChartData[i].status;
                    }
                }
                $scope.jiraChartData.splice(4, $scope.jiraChartData.length - 4);
                $scope.jiraChartData.push({ "status": "Others", "count": others_count, "status_filter": others_filter });
            }
        },true);

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/jira/overview.html',
        controller: directiveController,
        link: function ($scope) {
            var config = JiraConfig.getConfigInstanceForAppId($scope.metadata.guid);
            if (config.isInitialized() === false) {
                config.initialize($scope.metadata.guid);
                var jiraBox = JiraBox.getInstanceForAppId($scope.metadata.guid, config.getConfig().jira);
                jiraBox.isUserAuthenticated().then(function() {
                    $scope.authenticated = jiraBox.authenticated;
                    $scope.jira_url = jiraBox.jira_url;

                    if(jiraBox.authenticated){
                        jiraBox.getIssuesforQuery(config.getConfig().query, config.getConfig().maxHits);
                    }
                });
            }
            $scope.config = config.getConfig();
        }
    };
}]);
