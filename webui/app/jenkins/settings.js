angular.module('app.jenkins').appJenkinsSettings =
['$filter', 'ngTableParams', '$scope', "$route", "app.jenkins.configservice", "app.jenkins.dataService",

	function ($filter, ngTableParams, $scope, $route, jenkinsConfigService, jenkinsDataService) {
		var config = jenkinsConfigService.getConfigForAppId($scope.boxScope.metadata.guid);
		$scope.config = config;
		$scope.currentConfigValues = config.configItem;
		$scope.dataService = jenkinsDataService.getInstanceForAppId($scope.boxScope.metadata.guid);

		$scope.save_click = function() {
			$scope.$emit('closeSettingsScreen');
			$route.reload();
		};

		$scope.$watch('config', function () {
			if($scope.tableParams.settings().$scope != null) {
				$scope.tableParams.reload();
			}
		}, true);

		$scope.checkUrlAndLoadData = function() {
			$scope.dataService.setJenkinsUrl($scope.dataService.jenkinsData.url);
			$scope.dataService.isValidJenkinsUrl($scope.dataService.jenkinsData.url);
		};

		$scope.loadJobsForView = function() {
			$scope.dataService.getJenkinsJobsForCurrentView();
		};

		function doSearch(dataForSearch, searchExpression, maxLength) {
			var searchResult = [];
			searchExpression = searchExpression.toLowerCase();
			for (var i = 0; i < dataForSearch.length && searchResult.length < maxLength; i++) {
				var searchEntry = dataForSearch[i].name.toLowerCase();
				if(searchEntry &&
					searchEntry.indexOf(searchExpression) > -1) {
					searchResult.push(dataForSearch[i]);
				}
			}
			return searchResult;
		}

		$scope.doViewSearch = function(searchExpression, maxLength) {
			return doSearch($scope.dataService.jenkinsData.views, searchExpression, maxLength);
		};

		$scope.doJobSearch = function(searchExpression, maxLength) {
			var view = _.find($scope.dataService.jenkinsData.views, { "name":  $scope.dataService.jenkinsData.view });
			if(view && view.url && $scope.dataService.isValidUrl(view.url) ) {
				return doSearch($scope.dataService.jenkinsData.jobsForView, searchExpression, maxLength);
			} else {
				return doSearch($scope.dataService.jenkinsData.jobs, searchExpression, maxLength);
			}
		};

		function addConfigItem(copiedConfigItem) {
			$scope.config.addConfigItem(copiedConfigItem);
		}

		function isInArrayByName(nameString, candidateObjects) {
			for(var i = 0; i < candidateObjects.length; i++) {
				if(candidateObjects[i].name === nameString) {
					return true;
				}
			}
			return false;
		}

		$scope.isSelectedViewValid = function() {
			var selectedViewString = $scope.currentConfigValues.selectedView;
			var allViewObjects = $scope.currentConfigValues.views;

			return isInArrayByName(selectedViewString, allViewObjects);
		};

		$scope.isSelectedJobValidOrEmpty = function() {
			var selectedJobString = $scope.currentConfigValues.selectedJob;
			if(selectedJobString === "") {
				return true;
			}

			var selectedViewString = $scope.currentConfigValues.selectedView;
			var allJobs = $scope.getJobsByView(selectedViewString);
			return isInArrayByName(selectedJobString, allJobs);
		};

		$scope.isAddJobButtonDisabled = function() {
			return 	!$scope.dataService.jenkinsData.urlIsValid ||
					!$scope.dataService.jenkinsData.job ||
					!$scope.dataService.isValidJob($scope.dataService.jenkinsData.job);
		};

		$scope.isAddViewButtonDisabled = function() {
			return 	!$scope.dataService.jenkinsData.urlIsValid ||
					!$scope.dataService.jenkinsData.view ||
					!$scope.dataService.isValidView($scope.dataService.jenkinsData.view);
		};

		$scope.addJob_click = function() {
			if ($scope.dataService.jenkinsData.url && $scope.dataService.jenkinsData.job) {
				var configItem = {};
				configItem.jenkinsUrl = $scope.dataService.jenkinsData.url;
				configItem.selectedView = $scope.dataService.jenkinsData.view;
				configItem.selectedJob = $scope.dataService.jenkinsData.job;
				addConfigItem(configItem);
				$scope.dataService.updateJobs();
			}
		};

		$scope.addView_click = function() {
			if ($scope.dataService.jenkinsData.url && $scope.dataService.jenkinsData.view) {
				var configItem = {};
				configItem.jenkinsUrl = $scope.dataService.jenkinsData.url;
				configItem.selectedView = $scope.dataService.jenkinsData.view;
				configItem.selectedJob = "";
				addConfigItem(configItem);
				$scope.dataService.updateJobs();
			}
		};

		$scope.addAllJobs_click = function() {
			if ($scope.dataService.jenkinsData.url && $scope.dataService.jenkinsData.view) {
				angular.forEach($scope.dataService.jenkinsData.jobsForView, 	function(job) {
					var configItem = {};
					configItem.jenkinsUrl = $scope.dataService.jenkinsData.url;
					configItem.selectedView = $scope.dataService.jenkinsData.view;
					configItem.selectedJob = job.name;
					addConfigItem(configItem);
				});
				$scope.dataService.updateJobs();
			}
		};

		$scope.select_click = function(index) {
			if(config.configItems[index]) {
				$scope.dataService.jenkinsData.url = config.configItems[index].jenkinsUrl;
			}
		};

		$scope.remove_click = function (configItem) {
			var index = $scope.config.configItems.indexOf(configItem);
			if (index > -1) {
				$scope.config.configItems.splice(index, 1);
			}
		};

		$scope.removeAll_click = function () {
			if ($scope.config.configItems.length > 0) {
				$scope.config.configItems.splice(0, $scope.config.configItems.length);
			}
		};

		/*eslint-disable */
		$scope.tableParams = new ngTableParams({
		/*eslint-enable */
			page: 1,	// show first page
			count: 100	// count per page
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

			for(var viewNameIndex in config.configItem.jobsByView) {

				if(config.configItem.jobsByView[viewNameIndex].name === viewname) {
					jobsByView = jobsByView.concat(config.configItem.jobsByView[viewNameIndex].jobs);
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

		$scope.$watch("dataService.jenkinsData.url", function () {
			$scope.checkUrlAndLoadData();
		}, true);

		$scope.$watch("dataService.jenkinsData.view", function () {
			$scope.loadJobsForView();
		}, true);

}];
