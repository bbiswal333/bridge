angular.module('app.internalIncidentsMitosis').controller('app.internalIncidentsMitosis.detailController',['$scope', '$routeParams', 'bridge.converter', 'app.internalIncidentsMitosis.dataService', 'app.internalIncidentsMitosis.configService',
	function Controller($scope, $routeParams, converter, dataService, configService) {
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

        function toFixedLength(value) {
            if(value.toString().length === 1) {
                return "0" + value.toString();
            } else {
                return value;
            }
        }

        $scope.getFormattedDate = function(sAbapDate){
            if(!sAbapDate) {
                return "";
            }
            var date = converter.getDateFromAbapTimeString(sAbapDate);
            return toFixedLength(date.getDate()) + "." + toFixedLength((date.getMonth() + 1)) + "." + date.getFullYear();
        };
}]);
