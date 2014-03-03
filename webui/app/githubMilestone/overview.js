angular.module('app.githubMilestone', ["lib.utils"]);

angular.module('app.githubMilestone').directive('app.githubMilestone', 
    ['$http', 'app.githubMilestone.configservice', "lib.utils.calUtils", "bridgeConfig",
    function($http, appGithubMilestoneConfig, calUtils, bridgeConfig) {

       
    var directiveController = ['$scope', function($scope ) {
            $scope.boxTitle = "Github";
            $scope.initialized = true;
            $scope.boxIcon = '&#xe009;';
            $scope.settingsTitle = "Settings";
            $scope.error = {display: "none", msg: ""};

            //Settings Screen
            $scope.settingScreenData = {
            templatePath: "githubMilestone/settings.html",
                controller: angular.module('app.githubMilestone').appGithubMilestoneSettings,
                id: $scope.boxId,
            };
        

         $scope.returnConfig = function () {
                return appGithubMilestoneConfig;
            };

        $scope.getData = function() { 
            $scope.config = appGithubMilestoneConfig;

            $scope.boxTitle = "Github Milestone - "+$scope.config.repo.full_name;
                $http({
                    method: 'GET',
                    url: $scope.config.api_url+'repos/'+$scope.config.repo.full_name+'/milestones?state=' + $scope.config.stateProp + '&sort=due_date&direction=asc'

                }).success(function(data, status, headers, config) {
                    $scope.milestones = data;
                    var currentDate = new Date();

                    for (var i = $scope.milestones.length - 1; i >= 0; i--)(function(n) {

                        //Process
                        $scope.milestones[i].poc = Math.round((1 - ($scope.milestones[i].open_issues / ($scope.milestones[i].open_issues + $scope.milestones[i].closed_issues))) * 100); //Rate between open and closed Issues

                        //Time
                        if ($scope.milestones[i].due_on != undefined)
                        {
                            
                        var due_on = new Date(Date.parse($scope.milestones[i].due_on));
                        var start = new Date(due_on.getTime() - ($scope.config.milestoneDuration*1000*60*60*24) );
                        //console.log('Start: '+start);
                        //console.log('End '+due_on);
                        var due_in = calUtils.calcBusinessDays(start, due_on);
                        //console.log('due_in  '+due_in);
                        var pastDays = calUtils.calcBusinessDays(start,currentDate);
                        if(pastDays < 0) pastDays = 0;
                        //console.log('past days '+pastDays);
                        var pot =  (pastDays / due_in) * 100;
                        if(pot > 100) pot = 100;
                        //console.log('pot' +pot)
                        var remainingDays = due_in - pastDays;
                        if(remainingDays < 0) remainingDays = 0;

                        $scope.milestones[i].due_in         = due_in;
                        $scope.milestones[i].pastDays      = pastDays;
                        $scope.milestones[i].pot            = pot;
                        $scope.milestones[i].remainingDays  = remainingDays;
                        }

                    })(i);
                    $scope.error = {display: "none", msg: ""}; //Empty the error message
                }).error(function(data, status, headers, config) {
                    switch (status) 
                    { 
                        case 404:
                            $scope.milestones = "";
                            $scope.error = {display: "block", msg: "Repository \" "+$scope.config.repo.html_url+" \" doesn't exist" };
                            $scope.boxTitle = "Github Milestone - Repository doesn't exist";
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
         link: function ($scope, $element, $attrs, $modelCtrl) {
            var currentConfigItem;
            var appConfig = angular.copy(bridgeConfig.getConfigForApp($scope.boxId));

            if (appConfig != undefined) {

                    appGithubMilestoneConfig.repo.name = appConfig.repo.name;
                    appGithubMilestoneConfig.repo.full_name = appConfig.repo.full_name;
                    appGithubMilestoneConfig.repo.html_url = appConfig.repo.html_url;
                    appGithubMilestoneConfig.repo.api_url = appConfig.repo.api_url;
                    appGithubMilestoneConfig.milestoneDuration = appConfig.milestoneDuration;
                    appGithubMilestoneConfig.countMilestones = appConfig.countMilestones;
                    appGithubMilestoneConfig.html_url = appConfig.html_url;
                    appGithubMilestoneConfig.api_url = appConfig.api_url;
                    appGithubMilestoneConfig.fork = appConfig.fork;

                }
            }
        };
}]);





