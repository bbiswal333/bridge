angular.module('app.githubMilestone', ["lib.utils", "bridge.search"]);

angular.module('app.githubMilestone').directive('app.githubMilestone',
    ['$http', 'app.githubMilestone.configservice', "lib.utils.calUtils", "app.githubIssueSearch",
    function($http, appGithubMilestoneConfig, calUtils, githubIssueSearch) {

    githubIssueSearch.getSourceInfo();

    var directiveController = ['$scope', function($scope ) {
            var config = appGithubMilestoneConfig.getConfigInstanceForAppId($scope.metadata.guid);;
            $scope.box.boxSize = "2";
            $scope.box.settingsTitle = "Configure Repository and Duration";
            $scope.error = {display: false, msg: ""};
            //Settings Screen
            $scope.box.settingScreenData = {
            templatePath: "githubMilestone/settings.html",
                controller: angular.module('app.githubMilestone').appGithubMilestoneSettings,
                id: $scope.boxId
            };


        $scope.box.returnConfig = function () {
                return config;
            };

        function getTimeDimensions(due_on_str) {
            var currentDate = new Date();

            var due_on = new Date(Date.parse(due_on_str));
            var start = new Date(due_on.getTime() - (config.milestoneDuration * 1000 * 60 * 60 * 24));

            var due_in = calUtils.calcBusinessDays(start, due_on);

            var passedDays = calUtils.calcBusinessDays(start, currentDate);
            if (passedDays < 0)
            {
                passedDays = 0;
            }

            var timeProgress = (passedDays / due_in) * 100;
            if (timeProgress > 100)
            {
                timeProgress = 100;
            }

            var remainingDays = due_in - passedDays;
            if (remainingDays < 0)
            {
                remainingDays = 0;
            }

            return {
                dueIn: due_in,
                passedDays: passedDays,
                timeProgress: timeProgress,
                remainingDays: remainingDays
            };
        }

        $scope.getData = function() {
            $scope.config = config;

            $scope.boxTitle = "Github";
                $http({
                    method: 'GET',
                    url: $scope.config.api_url + 'repos/' + $scope.config.repo.full_name + '/milestones?state=' + $scope.config.stateProp + '&sort=due_date&direction=asc',
                    withCredentials: false
                }).success(function(data) {
                    if (data !== undefined && data.length !== 0){
                        $scope.milestones = data;
                        var foundADueMilestone = false;

                        for (var i = $scope.milestones.length - 1; i >= 0; i--) {
                            //Process
                            $scope.milestones[i].issueProgress = Math.round((1 - ($scope.milestones[i].open_issues / ($scope.milestones[i].open_issues + $scope.milestones[i].closed_issues))) * 100); //Rate between open and closed Issues

                            //Time
                            if ($scope.milestones[i].due_on)
                            {
                                foundADueMilestone = true;

                                var timeDimensions = getTimeDimensions($scope.milestones[i].due_on);

                                $scope.milestones[i].due_in = timeDimensions.dueIn;
                                $scope.milestones[i].passedDays = timeDimensions.passedDays;
                                $scope.milestones[i].timeProgress = timeDimensions.timeProgress;
                                $scope.milestones[i].remainingDays = timeDimensions.remainingDays;
                            }

                        }
                        if (!foundADueMilestone)
                        {
                            $scope.error = { display: true, msg: "No due milestone found in this project!" };
                        }
                        else
                        {
                            $scope.error = {display: false, msg: ""}; //Empty the error message
                        }
                    }
                    else {
                        $scope.error = {display: true, msg: "Sorry, no milestones found in this project!"};
                    }
                }).error(function(data, status) {
                switch (status)
                {
                    case 404:
                        $scope.milestones = "";
                        $scope.error = {display: true, msg: "Repository \"" + $scope.config.repo.html_url + "\" could not be accessed. Either the link is invalid or GitHub is currently in maintenance." };
                        $scope.boxTitle = "Github - Repository not reached";
                        break;
                }
                });
            };//getData

            //Watch for changes in the config
            $scope.$watch('config', function() {
                $scope.getData();
            },true);

            $scope.box.reloadApp($scope.getData, 60 * 5);
        }];

    return {
        restrict: 'E',
        templateUrl: 'app/githubMilestone/overview.html',
        controller: directiveController,
        link: function ($scope) {

            if ($scope.appConfig !== undefined && JSON.stringify($scope.appConfig) !== "{}") {
                var config = appGithubMilestoneConfig.getConfigInstanceForAppId($scope.metadata.guid);
                config.repo.name = $scope.appConfig.repo.name;
                config.repo.full_name = $scope.appConfig.repo.full_name;
                config.repo.html_url = $scope.appConfig.repo.html_url;
                config.repo.api_url = $scope.appConfig.repo.api_url;
                config.milestoneDuration = $scope.appConfig.milestoneDuration;
                config.countMilestones = $scope.appConfig.countMilestones;
                config.html_url = $scope.appConfig.html_url;
                config.api_url = $scope.appConfig.api_url;
                config.fork = $scope.appConfig.fork;
            }
        }
    };
}]);

angular.module('app.githubMilestone').service("app.githubIssueSearch", ['$http', 'app.githubMilestone.configservice', "bridge.search", "$window", function($http, githubConfig, bridgeSearch, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-github",
            name: "Github Issues"
        };
    };
    this.findMatches = function(query, resultArray) {
        return $http({
                        method: 'GET',
                        url: githubConfig.api_url + 'search/issues?q=' + query + '+repo:' + githubConfig.repo.full_name + '&origin=' + $window.location.origin,
                        withCredentials: false
                    }).then(
            function(response) {
                response.data.items.map(function(result) {
                    resultArray.push({title: result.title, originalIssue: result});
                });
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
            $window.open(selectedItem.originalIssue.html_url);
        };
    };

    bridgeSearch.addSearchProvider(this);
}]);
