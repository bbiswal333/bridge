angular.module('app.githubMilestone').appGithubMilestoneSettings = ['app.githubMilestone.configservice', '$scope',  function (appGithubMilestoneConfig, $scope) {


	 $scope.currentConfigValues = angular.copy(appGithubMilestoneConfig);

	 $scope.save_click = function () {  

	 	var copiedConfigItem = angular.copy($scope.currentConfigValues);
                    
        appGithubMilestoneConfig.repo = copiedConfigItem.repo;
        appGithubMilestoneConfig.milestoneDuration = copiedConfigItem.milestoneDuration;

    };
}];