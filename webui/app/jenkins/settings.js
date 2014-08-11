angular.module('app.jenkins').appJenkinsSettings =
['$scope', "app.jenkins.configservice",

	function ($scope, jenkinsConfigService) {    

		$scope.currentConfigValues = jenkinsConfigService.configItem;
		$scope.views = jenkinsConfigService.views;
		$scope.jobsByView = jenkinsConfigService.jobsByView;

		$scope.checkboxJobs = {};

		$scope.save_click = function () {  
			$scope.$emit('closeSettingsScreen');
		};

		$scope.getJobNamesByView = function(viewname) {

			var jobs = {};
			for(var jobsbyviewindex in $scope.jobsByView) {
					if($scope.jobsByView[jobsbyviewindex].name === viewname) {
						jobs = $scope.jobsByView[jobsbyviewindex].jobs;
					}
			}
			
			return jobs;

		};

}];
