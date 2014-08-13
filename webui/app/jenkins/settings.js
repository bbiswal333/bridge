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

		var viewIsChecked = function(viewname) {
			return (($scope.checkboxViews[viewname] === true) ? true : false);
		};

		$scope.getJobsByView = function(viewname) {

			var jobsByGivenView = {};

			for(var viewIndex in $scope.jobsByView) {

					if($scope.jobsByView[viewIndex].name === viewname && viewIsChecked(viewname)) {
						jobsByGivenView = $scope.jobsByView[viewIndex].jobs;
					}

			}
			
			return jobsByGivenView;

		};

}];
