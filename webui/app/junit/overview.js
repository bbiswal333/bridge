angular.module('app.junit', ['app.junit.data']);

angular.module('app.junit').directive('app.junit',
  ['app.junit.configService', 'app.junit.dataService', 'trafficLightService',
	function (configService, dataService, trafficLightService) {

	var directiveController = ['$scope', function ($scope) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure junit App";

    $scope.box.settingScreenData = {
			templatePath: "junit/settings.html",
      controller: angular.module('app.junit').appJUnitSettings
		};

    $scope.box.headerIcons = [{
        iconCss: "fa-refresh",
        title: "Refresh",
        callback: function() {
            $scope.getData();
        }
    }];

    $scope.numSuccessTestCases = 0;
    $scope.numFailedTestCases = 0;
    $scope.numErrorTestCases = 0;

		$scope.updateTrafficLight = function() {
			if ( $scope.numFailedTestCases || $scope.numErrorTestCases) {
				trafficLightService.forApp($scope.metadata.guid).red( );
			}
			else {
				trafficLightService.forApp($scope.metadata.guid).green( );
			}
		};

		$scope.getData = function() {

      var promises = [];
      $scope.numSuccessTestCases = 0;
      $scope.numFailedTestCases = 0;
      $scope.numErrorTestCases = 0;
      $scope.box.errorText = '';

      promises = dataService.getInstanceForAppId($scope.metadata.guid).loadData();

      if(promises.length !== 0) {
        promises.forEach(function(promise) {
          promise.then(function(value) {
            $scope.numSuccessTestCases += value.result.numSuccessTestCases;
            $scope.numFailedTestCases += value.result.numFailedTestCases;
            $scope.numErrorTestCases += value.result.numErrorTestCases;

  					$scope.updateTrafficLight( );
          }, function() {
            $scope.box.errorText = 'Failed to fetch results from one or more source(s).';
          });
  			});
      }
      else {
        // No URL is configured, we have to set the traffic light to green
        this.updateTrafficLight( );
      }
		};

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function () {
      return configService.getConfigForAppId($scope.metadata.guid);
    };

		// Bridge framework function to take care of refresh
		$scope.box.reloadApp($scope.getData, 60 * 60);

    $scope.config = $scope.config || configService.getConfigForAppId($scope.metadata.guid);

    $scope.$watch('config', function (newVal, oldVal) {
      if (newVal !== oldVal) { // this avoids the call of our change listener for the initial watch setup
        $scope.getData();
      }
    }, true);
	}];

	var linkFn = function ($scope) {
    if (configService.getConfigForAppId($scope.metadata.guid).isInitialized === false) {
      configService.getConfigForAppId($scope.metadata.guid).initialize($scope.metadata.guid);
      $scope.getData();
    }
	};

	return {
		restrict: 'E',
		templateUrl: 'app/junit/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
