angular.module('app.internalIncidentsMitosis').controller('app.internalIncidentsMitosis.detailController',['$scope', '$routeParams', 'bridge.converter', 'app.internalIncidentsMitosis.dataService', 'app.internalIncidentsMitosis.configService',
	function Controller($scope, $routeParams, converter, dataService, configService) {
		$scope.$parent.titleExtension = " - Incident Details";

        var incidentData = dataService.getInstanceFor($routeParams.appId);
        var incidentConfig = configService.getInstanceForAppId($routeParams.appId);
        $scope.config = incidentConfig;

        function setIncidents() {
            $scope.incidents = incidentData.details[$routeParams.priority];
        }

        if(!incidentConfig.isInitialized) {
        	incidentConfig.initialize();
        }

        $scope.loadingIncidentsPromise = incidentData.loadDetails(incidentConfig).then(function() {
        	setIncidents();
        });

        function toFixedLength(value) {
            if(value.toString().length === 1) {
                return "0" + value.toString();
            } else {
                return value;
            }
        }

        $scope.getFormattedDate = function(date){
            if(!date) {
                return "";
            }
            var match = /Date\((\d+)\)/.exec(date);
            if(match && match[1]) {
                date = new Date(parseInt(match[1]));
            } else{
                return date;
            }
            return toFixedLength(date.getDate()) + "." + toFixedLength((date.getMonth() + 1)) + "." + date.getFullYear();
        };
}]);
