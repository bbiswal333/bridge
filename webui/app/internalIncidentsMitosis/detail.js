angular.module('app.internalIncidentsMitosis').controller('app.internalIncidentsMitosis.detailController',['$scope', '$routeParams', 'app.internalIncidentsMitosis.dataService', 'app.internalIncidentsMitosis.configService',
	function Controller($scope, $routeParams, dataService, configService) {
		$scope.$parent.titleExtension = " - Incident Details";

        var incidentData = dataService.getInstanceFor($routeParams.appId);
        var incidentConfig = configService.getInstanceForAppId($routeParams.appId);
        $scope.config = incidentConfig;

        function setIncidents() {
            $scope.incidents = incidentData[$routeParams.priority];
        }

        if(!incidentConfig.isInitialized) {
        	incidentConfig.initialize();
        }

        if(!incidentData.prio1) {
        	incidentData.loadData(incidentConfig).then(function() {
        		setIncidents();
        	});
        } else {
        	setIncidents();
        }
}]);
