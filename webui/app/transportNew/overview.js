angular.module('app.transportNew', ['ui.bootstrap.datepicker']);
angular.module('app.transportNew').directive('app.transportNew', ['app.transportNew.dataService', 'app.transportNew.configService', function (dataService, configService) {

	var directiveController = ['$scope', function ($scope)
	{
		var transportConfig = configService.getInstanceForAppId($scope.metadata.guid);
		var transportData = dataService.getInstanceFor($scope.metadata.guid);
		$scope.transportConfig = transportConfig;

		$scope.box.boxSize = "1";

        function setAppDataFromTransportData() {
        	$scope.numOpenTransports = transportData.openTransports.length;
			$scope.numOpenTransportsLongerThanThreshold = transportData.transportsOpenForLongerThanThreshold.length;
        }

        $scope.handleTransports = function() {
			$scope.loadingOpenTransportsPromise = transportData.loadData(transportConfig).then(function() {
				setAppDataFromTransportData();
			});
		};

        if (transportConfig.isInitialized === false) {
        	transportConfig.initialize();
            $scope.handleTransports();
			$scope.box.reloadApp($scope.handleTransports, 60 * 5);
        } else {
        	setAppDataFromTransportData();
        }
        transportConfig.isInitialized = true;

        $scope.$watch("transportConfig", function(newValue, oldValue) {
			if(oldValue !== undefined && JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
				$scope.handleTransports();
			}
		}, true);

		$scope.box.settingScreenData = {
            templatePath: "transportNew/settings.html",
            controller: angular.module('app.transportNew').appTransportSettings
        };
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/transportNew/overview.html',
		controller: directiveController
	};
}]);
