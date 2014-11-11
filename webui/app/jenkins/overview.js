angular.module("app.jenkins", []);
angular.module("app.jenkins").directive("app.jenkins", ["app.jenkins.configservice", "app.jenkins.dataService", function (jenkinsConfigService, jenkinsDataService) {

	var directiveController = ["$scope", function ($scope) {
		var config = jenkinsConfigService.getConfigForAppId($scope.metadata.guid);

		$scope.box.boxSize = '2';
        $scope.showJobs = false;
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

        $scope.displayJobs = function(){
            $scope.showJobs = true;
        };

        $scope.getStatusCount = function(jobsToDisplay){
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

		$scope.initializeJobsView = function() {
			$scope.dataService.jobsToDisplay = config.configItems;
			for(var jobIndex in $scope.dataService.jobsToDisplay) {
				$scope.dataService.jobsToDisplay[jobIndex].timestamp = "loading...";
				$scope.dataService.jobsToDisplay[jobIndex].lastBuild = "0000000000000";
			}
			$scope.dataService.updateJobs().then(function(){
                $scope.getStatusCount($scope.dataService.jobsToDisplay);
            });
		};

		$scope.box.reloadApp($scope.dataService.updateJobs, 60 * 2);
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
