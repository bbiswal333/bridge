angular.module('app.githubMilestone', []);

angular.module('app.githubMilestone').directive('app.githubMilestone', function() {

    var directiveController = ['$scope', '$http', 'app.githubMilestone.configservice',
        function($scope, $http, appGithubMilestoneConfig) {
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

            getData();

            function getData() { 
            $scope.config = appGithubMilestoneConfig;

            $scope.boxTitle = "Github Milestone - "+$scope.config.repo.full_name;
                $http({
                    method: 'GET',
                    url: $scope.config.api_url+'repos/'+$scope.config.repo.full_name+'/milestones?state=' + $scope.config.stateProp + '&sort=due_date&direction=asc',
                    withCredentials: false,
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
                        var due_in = calcBusinessDays(start, due_on);
                        //console.log('due_in  '+due_in);
                        var pastDays = calcBusinessDays(start,currentDate);
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

            function calcBusinessDays(dDate1, dDate2) { // input given as Date objects
                var iWeeks, iDateDiff, iAdjust = 0;
                if (dDate2 < dDate1) return -1; // error code if dates transposed

                var iWeekday1 = dDate1.getDay(); // day of week
                var iWeekday2 = dDate2.getDay();

                iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
                iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;

                if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
                iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
                iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

                // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
                iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

                if (iWeekday1 <= iWeekday2) {
                  iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
                } else {
                  iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
                }

                iDateDiff -= iAdjust // take into account both days on weekend

                return (iDateDiff ); // add 1 because dates are inclusive
            };//calcBusinessDays

            //Watch for changes in the config
            $scope.$watch('config', function() {
                $scope.update();
            },true);

            //Update the app
            $scope.update = function() {
                getData();
            };//$scope.update

           
        }
    ];

    return {
        restrict: 'E',
        templateUrl: 'app/githubMilestone/overview.html',
        controller: directiveController
    };
});
