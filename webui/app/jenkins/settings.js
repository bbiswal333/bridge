angular.module('app.jenkins').appJenkinsSettings =
['$filter', 'ngTableParams', '$scope', "app.jenkins.configservice",

	function ($filter, ngTableParams, $scope, jenkinsConfigService) {    

		$scope.config = jenkinsConfigService;
		$scope.currentConfigValues = jenkinsConfigService.configItem;

		$scope.save_click = function() {  
			$scope.$emit('closeSettingsScreen');
		};

		$scope.$watch('config', function () {
			if($scope.tableParams.settings().$scope != null) {
				$scope.tableParams.reload();
			}
		}, true);

		$scope.add_click = function() {
			if (!$scope.config.isEmpty()) {
				var copiedConfigItem = angular.copy($scope.currentConfigValues);
				$scope.config.clear();
				jenkinsConfigService.addConfigItem(copiedConfigItem);
			}
		};

		$scope.remove_click = function (configItem) {
			var index = $scope.config.configItems.indexOf(configItem);
			if (index > -1) {
				$scope.config.configItems.splice(index, 1);
			}
		};

		/*eslint-disable */
		$scope.tableParams = new ngTableParams({
		/*eslint-enable */
		    page: 1,            // show first page
			count: 100           // count per page
		}, {
			counts: [], // hide page counts control
			total: $scope.config.configItems.length,
			getData: function ($defer, params) {
				var orderedData = params.sorting() ?
					$filter('orderBy')($scope.config.configItems, params.orderBy()) :
					$scope.config.configItems;

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});

		$scope.getJobsByView = function(viewname) {

			var jobsByView = [];

			for(var viewNameIndex in jenkinsConfigService.configItem.jobsByView) {

				if(jenkinsConfigService.configItem.jobsByView[viewNameIndex].name === viewname) {

					jobsByView = jobsByView.concat(jenkinsConfigService.configItem.jobsByView[viewNameIndex].jobs);

				}

			}

			return jobsByView;

		};

		$scope.limitDisplayName = function(name, limit) {
            if(name.toString().length > limit) {
                return name.toString().substring(0,limit) + " ... ";
            }
            return name;
        };

}];
