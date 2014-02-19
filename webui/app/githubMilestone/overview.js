angular.module('app.githubMilestone', []);

angular.module('app.githubMilestone').directive('app.githubMilestone', function() {

    var directiveController = ['$scope', '$http', 'app.githubMilestone.configservice',
        function($scope, $http, appGithubMilestoneConfig) {
            $scope.boxTitle = "Github Milestone";
            $scope.initialized = true;
            $scope.boxIcon = '&#xe009;';
            $scope.settingsTitle = "Settings";
            $scope.error = {display: "none", msg: ""};

            $scope.settingScreenData = {
            templatePath: "githubMilestone/settings.html",
                controller: angular.module('app.githubMilestone').appGithubMilestoneSettings,
                id: $scope.boxId,
            };

             

            //Settings
            $scope.countMilestones = 1;
            $scope.stateProp = 'open';
            $scope.urlGithub = 'https://github.wdf.sap.corp/';
            var urlApi = "https://github.wdf.sap.corp/api/v3/";


            getData();

            console.log($scope);
            function getData() { 
            $scope.config = appGithubMilestoneConfig;

            $scope.boxTitle = "Github Milestone - "+$scope.config.repo;

                $http({
                    method: 'GET',
                    url: urlApi+'repos/' + $scope.config.repo + '/milestones?state=' + $scope.stateProp + '&sort=due_date&direction=asc'
                }).
                success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.milestones = data;
                    var currentDate = new Date();


                    for (var i = $scope.milestones.length - 1; i >= 0; i--)(function(n) {

                        var due_on = new Date(Date.parse($scope.milestones[i].due_on));
                        var due_in = Math.floor((due_on - currentDate) / (24 * 60 * 60 * 1000));
                        $scope.milestones[i].due_in = due_in;
                        $scope.milestones[i].pot = Math.round((1 - (due_in / $scope.config.milestoneDuration)) * 100);
                        $scope.milestones[i].poc = Math.round((1 - ($scope.milestones[i].open_issues / ($scope.milestones[i].open_issues + $scope.milestones[i].closed_issues))) * 100);
                        $scope.milestones[i].milestoneDuration = $scope.config.milestoneDuration;                 
                    })(i);
                    $scope.error = {display: "none", msg: ""};

                }).error(function(data, status, headers, config) {
                    switch (status){
                        case 404:
                            $scope.milestones = "";
                            $scope.error = {display: "block", msg: "Repository \" "+$scope.config.repo+" \" doesn't exist" };
                            
                            $scope.boxTitle = "Github Milestone - Repository doesn't exist";
                            break;
                    }
                });
            };


            $scope.$watch('config', function() {
                $scope.update();
            },true);

            $scope.update = function() {
                getData();
            };
        }
    ];

    return {
        restrict: 'E',
        templateUrl: 'app/githubMilestone/overview.html',
        controller: directiveController
    };
});
