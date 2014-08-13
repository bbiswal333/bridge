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

		$scope.getAllJobsOfCheckedViews = function() {

			var allJobs = [];

			for(var viewIndex in $scope.jobsByView) {

				if(viewIsChecked($scope.jobsByView[viewIndex].name)) {
					allJobs = allJobs.concat($scope.jobsByView[viewIndex].jobs);
				}
				
			}

			return allJobs;

		};

}];
