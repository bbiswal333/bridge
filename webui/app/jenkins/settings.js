angular.module('app.jenkins').appJenkinsSettings =
['$scope', "app.jenkins.configservice",

	function ($scope, jenkinsConfigService) {    

		$scope.currentConfigValues = jenkinsConfigService.configItem;
		$scope.views = jenkinsConfigService.configItem.views;
		$scope.jobsByView = jenkinsConfigService.configItem.jobsByView;

		$scope.checkboxJobs = jenkinsConfigService.configItem.checkboxJobs;
		$scope.checkboxViews = jenkinsConfigService.configItem.checkboxViews;

		$scope.save_click = function () {  
			$scope.$emit('closeSettingsScreen');
		};

		$scope.getJobsByView = function(viewname) {

			var jobs = {};
			for(var jobsbyviewindex in $scope.jobsByView) {
					if($scope.jobsByView[jobsbyviewindex].name === viewname) {
						jobs = $scope.jobsByView[jobsbyviewindex].jobs;
					}
			}
			
			return jobs;

		};

}];
