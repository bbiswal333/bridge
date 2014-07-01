angular.module('app.githubMilestone', ["lib.utils"]);

angular.module('app.githubMilestone').directive('app.githubMilestone', 
    ['$http', 'app.githubMilestone.configservice', "lib.utils.calUtils",
    function($http, appGithubMilestoneConfig, calUtils) {

       
    var directiveController = ['$scope', function($scope ) {           
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
                return appGithubMilestoneConfig;
            };

        function getTimeDimensions(due_on_str) {
            var currentDate = new Date();

            var due_on = new Date(Date.parse(due_on_str));
            var start = new Date(due_on.getTime() - ($scope.config.milestoneDuration * 1000 * 60 * 60 * 24));
            
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
            $scope.config = appGithubMilestoneConfig;

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
                            if ($scope.milestones[i].due_on !== undefined)
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
        }];

    return {
        restrict: 'E',
        templateUrl: 'app/githubMilestone/overview.html',
        controller: directiveController,
        link: function ($scope) {            

            if ($scope.appConfig !== undefined && JSON.stringify($scope.appConfig) !== "{}") {
                appGithubMilestoneConfig.repo.name = $scope.appConfig.repo.name;
                appGithubMilestoneConfig.repo.full_name = $scope.appConfig.repo.full_name;
                appGithubMilestoneConfig.repo.html_url = $scope.appConfig.repo.html_url;
                appGithubMilestoneConfig.repo.api_url = $scope.appConfig.repo.api_url;
                appGithubMilestoneConfig.milestoneDuration = $scope.appConfig.milestoneDuration;
                appGithubMilestoneConfig.countMilestones = $scope.appConfig.countMilestones;
                appGithubMilestoneConfig.html_url = $scope.appConfig.html_url;
                appGithubMilestoneConfig.api_url = $scope.appConfig.api_url;
                appGithubMilestoneConfig.fork = $scope.appConfig.fork;
            }
        }
    };
}]);





