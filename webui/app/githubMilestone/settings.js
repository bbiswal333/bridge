angular.module('app.githubMilestone').appGithubMilestoneSettings = ['app.githubMilestone.configservice', '$scope',  function (appGithubMilestoneConfig, $scope) {

	 $scope.currentConfigValues = angular.copy(appGithubMilestoneConfig);


	 $scope.save_click = function () {  
	 	var copiedConfigItem = angular.copy($scope.currentConfigValues);        			//Copy the Current input values
        appGithubMilestoneConfig.repo = copiedConfigItem.repo;								//Set the Config Item
        appGithubMilestoneConfig.milestoneDuration = copiedConfigItem.milestoneDuration;
    };//$scope.save_click

   /* $scope.search_repo = function () {
    	$http({
                    method: 'GET',
                    url: $scope.currentConfigValues.urlApi+'search/repositories?q='+$scope.currentConfigValues.repo+'&per_page=8' 

                }).success(function(data, status, headers, config) {
                   
                }).error(function(data, status, headers, config) {

                });

https://github.wdf.sap.corp/api/v3/search/repositories?q=b&per_page=5


    };//$scope.search_repo 
*/

}];