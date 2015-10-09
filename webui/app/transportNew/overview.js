angular.module('app.transportNew', []);
angular.module('app.transportNew').directive('app.transportNew', ['app.transportNew.dataService', 'app.transportNew.configService', function (dataService, configService) {

	var directiveController = ['$scope', function ($scope)
	{
		var transportConfig = configService.getInstanceForAppId($scope.metadata.guid);
		var transportData = dataService.getInstanceFor($scope.metadata.guid);
		$scope.transportConfig = transportConfig;

		$scope.box.boxSize = "1";

		$scope.box.returnConfig = function () {
            return angular.copy(transportConfig);
        };

        function toDate(dateString) {
        	if(dateString) {
        		return new Date(dateString);
        	} else {
        		return new Date();
        	}
        }

        function setAppDataFromTransportData() {
        	$scope.numOpenTransports = transportData.openTransports.length;
			$scope.numOpenTransportsLongerThanThreshold = 0;
			if(transportConfig.openTransportThreshold) {
				var thresholdDaysAgo = new Date(new Date().setDate(new Date().getDate() - transportConfig.openTransportThreshold));
				transportData.openTransports.map(function(transport) {
					if( toDate(transport.FIRST_OCCURENCE) < thresholdDaysAgo) {
						$scope.numOpenTransportsLongerThanThreshold++;
					}
				});
			}
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
