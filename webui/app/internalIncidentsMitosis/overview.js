angular.module('app.internalIncidentsMitosis', []);
angular.module('app.internalIncidentsMitosis').directive('app.internalIncidentsMitosis', ['app.internalIncidentsMitosis.dataService', 'app.internalIncidentsMitosis.configService', function (dataService, configService) {

	var directiveController = ['$scope', function ($scope)
	{
		var incidentConfig = configService.getInstanceForAppId($scope.metadata.guid);
		var incidentData = dataService.getInstanceFor($scope.metadata.guid);
		$scope.incidentConfig = incidentConfig;

		$scope.box.boxSize = "1";

		$scope.box.returnConfig = function () {
            return angular.copy(incidentConfig);
        };

        function setAppDataFromIncidentData() {
        	$scope.limit = incidentData.limit;
        	$scope.limitExceeded = incidentData.limitExceeded;
        	$scope.numPrio1 = incidentData.prio1.length;
			$scope.numPrio2 = incidentData.prio2.length;
			$scope.numPrio3 = incidentData.prio3.length;
			$scope.numPrio4 = incidentData.prio4.length;
        }

        $scope.handleIncidents = function() {
			$scope.loadingOpenIncidentsPromise = incidentData.loadData(incidentConfig).then(function() {
				setAppDataFromIncidentData();
			});
		};

        if (incidentConfig.isInitialized === false) {
        	incidentConfig.initialize();
            $scope.handleIncidents();
			$scope.box.reloadApp($scope.handleIncidents, 60 * 5);
        } else {
        	setAppDataFromIncidentData();
        }
        incidentConfig.isInitialized = true;

        $scope.$watch("incidentConfig", function(newValue, oldValue) {
			if(oldValue !== undefined && JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
				$scope.handleIncidents();
			}
		}, true);

		$scope.box.settingScreenData = {
            templatePath: "internalIncidentsMitosis/settings.html",
            controller: angular.module('app.internalIncidentsMitosis').appIncidentSettings
        };
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/internalIncidentsMitosis/overview.html',
		controller: directiveController
	};
}]);
