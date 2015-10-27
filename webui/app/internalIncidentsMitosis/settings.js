angular.module('app.internalIncidentsMitosis').appIncidentSettings = ['$scope', '$http', 'app.internalIncidentsMitosis.configService', function ($scope, $http, configService)
{
	var incidentConfig = configService.getInstanceForAppId($scope.boxScope.metadata.guid);

	$scope.component = "";
	$scope.owner = "";
	$scope.system = "";

	$scope.currentConfigValues = incidentConfig;

	$scope.searchPrograms = function(query) {
		return $http.get("https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/programs.xsodata/Programs?$format=json&$top=10&$filter=indexof(toupper(TP_PROGRAM_TXT), '" + query.toUpperCase() + "') ne -1").then(function(response) {
			return response.data.d.results;
		});
	};

	$scope.onSelectProgram = function(item) {
		if(typeof item === "string") {
			return;
		}

		if($scope.currentConfigValues.programs.indexOf(item) < 0) {
			$scope.currentConfigValues.programs.push(item);
		}
	};

	$scope.removeProgram = function(item) {
		$scope.currentConfigValues.programs.splice($scope.currentConfigValues.programs.indexOf(item), 1);
	};

	$scope.searchComponents = function(query) {
		return $http.get("https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/components.xsodata/Component?$format=json&$top=10&$filter=startswith(II_CATEGORY, '" + query.toUpperCase() + "')").then(function(response) {
			return response.data.d.results;
		});
	};

	$scope.onSelectComponent = function(item) {
		if(typeof item === "string") {
			if($scope.currentConfigValues.components.indexOf(item) < 0) {
				$scope.currentConfigValues.components.push(item);
			}
		} else {
			if($scope.currentConfigValues.components.indexOf(item.II_CATEGORY) < 0) {
				$scope.currentConfigValues.components.push(item.II_CATEGORY);
			}
		}
	};

	$scope.removeComponent = function(item) {
		$scope.currentConfigValues.components.splice($scope.currentConfigValues.components.indexOf(item), 1);
	};

	$scope.searchSystems = function(query) {
		return $http.get("https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/systems.xsodata/System?$format=json&$top=15&$filter=startswith(II_SYSTEM_ID, '" + query.toUpperCase() + "')").then(function(response) {
			return response.data.d.results;
		});
	};

	$scope.onSelectSystem = function(item) {
		if(typeof item === "string") {
			if($scope.currentConfigValues.systems.indexOf(item) < 0) {
				$scope.currentConfigValues.systems.push(item);
			}
		} else {
			if($scope.currentConfigValues.systems.indexOf(item.II_SYSTEM_ID) < 0) {
				$scope.currentConfigValues.systems.push(item.II_SYSTEM_ID);
			}
		}
	};

	$scope.removeSystem = function(item) {
		$scope.currentConfigValues.systems.splice($scope.currentConfigValues.systems.indexOf(item), 1);
	};

	$scope.save_click = function ()
	{
		$scope.$emit('closeSettingsScreen');
    };
}];
