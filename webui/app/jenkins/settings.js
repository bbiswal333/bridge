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
			return ((jenkinsConfigService.configItem.checkboxViews[viewname] === true) ? true : false);
		};

		$scope.getJobsOfCheckedViews = function(jobsByView) {

			var jobsOfCheckedViews = [];

			for(var viewNameIndex in jobsByView) {

				if(viewIsChecked(jobsByView[viewNameIndex].name)) {

					jobsOfCheckedViews = jobsOfCheckedViews.concat(jobsByView[viewNameIndex].jobs);

				}

			}

			return jobsOfCheckedViews;

		};

		$scope.limitDisplayName = function(name, limit) {
            if(name.toString().length > limit) {
                return name.toString().substring(0,limit) + " ... ";
            }
            return name;
        };

}];
