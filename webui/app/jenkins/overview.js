angular.module("app.jenkins", ["notifier"]);
angular.module("app.jenkins").directive("app.jenkins", ["app.jenkins.configservice", "app.jenkins.dataService", "$q", function (jenkinsConfigService, jenkinsDataService, $q) {

	var directiveController = ["$scope", "trafficLightService", function ($scope, trafficLightService) {
		var config = jenkinsConfigService.getConfigForAppId($scope.metadata.guid);

		$scope.box.boxSize = '2';
        $scope.showJobs = false;
        $scope.statusInfoToDisplay = "";
        $scope.redCount = 0;
        $scope.yellowCount = 0;
        $scope.greenCount = 0;
        $scope.runningCount = 0;
        $scope.jobsToDisplayColor = [];
		$scope.configService = config;
		$scope.dataService = jenkinsDataService.getInstanceForAppId($scope.metadata.guid);

		// Settings Screen
		$scope.box.settingsTitle = "Configure Jenkins URL";
		$scope.box.settingScreenData = {
			templatePath: "/jenkins/settings.html",
			controller: angular.module("app.jenkins").appJenkinsSettings,
			id: $scope.boxId
		};

		$scope.box.returnConfig = function() {
			return angular.copy($scope.configService);
		};

		$scope.noJobSelected = function() {
			if($scope.dataService.jobsToDisplay.length === 0) {
				return true;
			} else {
				return false;
			}
		};

        $scope.displayJobs = function(statusInfo){
            $scope.showJobs = true;
            $scope.statusInfoToDisplay = statusInfo;
        };

        $scope.getStatusCount = function(jobsToDisplay){
        	$scope.redCount = 0;
        	$scope.greenCount = 0;
        	$scope.yellowCount = 0;
        	$scope.runningCount - 0;
            for(var jobIndex in jobsToDisplay) {
                if(jobsToDisplay[jobIndex].statusInfo === "Failed") {
                    $scope.redCount = $scope.redCount + 1;
                } else if(jobsToDisplay[jobIndex].statusInfo === "Success") {
                    $scope.greenCount = $scope.greenCount + 1;
                } else if(jobsToDisplay[jobIndex].statusInfo === "Unstable") {
                    $scope.yellowCount = $scope.yellowCount + 1;
                } else if(jobsToDisplay[jobIndex].statusInfo === "Running") {
                    $scope.runningCount = $scope.runningCount + 1;
                }
            }
        };

		$scope.limitDisplayName = function(name, limit) {
			if(name.toString().length > limit) {
				return name.toString().substring(0,limit) + " ... ";
			}
			return name;
		};

		function updateTrafficLight() {
			if ($scope.redCount !== 0) {
				trafficLightService.forApp($scope.metadata.guid).red();
			}
			else if ($scope.yellowCount !== 0 || $scope.runningCount !== 0) {
				trafficLightService.forApp($scope.metadata.guid).yellow();
			}
			else if ($scope.greenCount !== 0) {
				trafficLightService.forApp($scope.metadata.guid).green();
			}
			else {
				trafficLightService.forApp($scope.metadata.guid).off();
			}
		}

		function updateStatus() {
			for(var jobIndex in $scope.dataService.jobsToDisplay) {
				$scope.dataService.jobsToDisplay[jobIndex].timestamp = "loading...";
				$scope.dataService.jobsToDisplay[jobIndex].lastBuild = "0000000000000";
			}
			$scope.dataService.updateJobs().then(function(){
				$scope.getStatusCount($scope.dataService.jobsToDisplay);
				updateTrafficLight();
			});
		}

		$scope.initializeJobsView = function() {
			var promises = [];
			var promise = {};
			$scope.dataService.jobsToDisplay = [];

			angular.forEach(config.configItems, function(configItem) {
				if (configItem.selectedJob) {
					$scope.dataService.jobsToDisplay.push(configItem);
				} else if (configItem.selectedView) {
					promise = $scope.dataService.getJenkinsJobsForView(configItem.jenkinsUrl, configItem.selectedView, configItem.viewUrl);
					promises.push(promise);
					promise.then(function(jobs) {
						angular.forEach(jobs, function(job) {
							var jobInConfigItemStyle = {};
							jobInConfigItemStyle.jenkinsUrl = configItem.jenkinsUrl;
							jobInConfigItemStyle.selectedView = configItem.selectedView;
							jobInConfigItemStyle.selectedJob = job.name;
							$scope.dataService.jobsToDisplay.push(jobInConfigItemStyle);
						});
					});
				}
			});

			if (promises.length > 0) {
				promise = $q.all(promises);
				promise.then(function() {
					updateStatus();
				});
			} else {
				updateStatus();
			}
		};

		$scope.box.reloadApp(updateStatus, 60 * 2);
	}];

	return {
		restrict: 'E',
		templateUrl: "app/jenkins/overview.html",
		controller: directiveController,
		link: function ($scope) {
			var config = jenkinsConfigService.getConfigForAppId($scope.metadata.guid);
			if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
				config.cleanUpConfigItem($scope.appConfig.configItem);
				config.configItem = $scope.appConfig.configItem;
				for(var index in $scope.appConfig.configItems) {
					config.cleanUpConfigItem($scope.appConfig.configItems[index]);
				}
				config.configItems = $scope.appConfig.configItems;
			} else {
				config.cleanUpConfigItem(config.configItem);
				$scope.appConfig.configItem = config.configItem;
				for(index in $scope.appConfig.configItems) {
					config.cleanUpConfigItem(config.configItems[index]);
				}
				$scope.appConfig.configItems = config.configItems;
			}

			for(var jobIndex in $scope.appConfig.configItems) {
				delete $scope.appConfig.configItems[jobIndex].downstreamProjects;
				delete $scope.appConfig.configItems[jobIndex].upstreamProjects;
				delete $scope.appConfig.configItems[jobIndex].timestamp;
				delete $scope.appConfig.configItems[jobIndex].lastBuild;
				delete $scope.appConfig.configItems[jobIndex].lastbuildUrl;
				delete $scope.appConfig.configItems[jobIndex].statusInfo;
				delete $scope.appConfig.configItems[jobIndex].color;
				delete $scope.appConfig.configItems[jobIndex].jobHealthReport;
				delete $scope.appConfig.configItems[jobIndex].statusColor;
				delete $scope.appConfig.configItems[jobIndex].statusIcon;
				delete $scope.appConfig.configItems[jobIndex].url;
			}
			$scope.initializeJobsView();
		}
	};
}]);
