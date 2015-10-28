angular.module('app.internalIncidents')
    .controller('app.internalIncidents.settingsController', ["$scope", "$http", "app.internalIncidents.configservice", function($scope, $http, configService){

        $scope.config = configService.getConfigForAppId($scope.boxScope.metadata.guid);

        $scope.searchPrograms = function(query) {
			return $http.get("https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/programs.xsodata/Programs?$format=json&$top=10&$filter=indexof(toupper(TP_PROGRAM_TXT), '" + query.toUpperCase() + "') ne -1").then(function(response) {
				return response.data.d.results;
			});
		};

		$scope.onSelectProgram = function(item) {
			if(typeof item === "string") {
				return;
			}

			if($scope.config.data.programs.indexOf(item) < 0) {
				$scope.config.data.programs.push(item);
				item.SYSTEMS = [];
				$http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_SYSTEMS_FOR_PROGRAM?PRG_ID=" + item.TP_PROGRAM).then(function(result) {
					result.data.SYSTEMS.map(function(system) {
						item.SYSTEMS.push(system.SYS_ID);
					});
				});
			}
		};

		$scope.removeProgram = function(item) {
			$scope.config.data.programs.splice($scope.config.data.programs.indexOf(item), 1);
		};

		$scope.removeProgramSystem = function(program, system) {
			program.SYSTEMS.splice(program.SYSTEMS.indexOf(system), 1);
		};

		$scope.searchComponents = function(query) {
			return $http.get("https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/components.xsodata/Component?$format=json&$top=10&$filter=startswith(II_CATEGORY, '" + query.toUpperCase() + "')").then(function(response) {
				return response.data.d.results;
			});
		};

		$scope.onSelectComponent = function(item) {
			if(typeof item === "string") {
				if($scope.config.data.components.indexOf(item) < 0) {
					$scope.config.data.components.push(item);
				}
			} else {
				if($scope.config.data.components.indexOf(item.II_CATEGORY) < 0) {
					$scope.config.data.components.push(item.II_CATEGORY);
				}
			}
		};

		$scope.removeComponent = function(item) {
			$scope.config.data.components.splice($scope.config.data.components.indexOf(item), 1);
		};

		$scope.searchSystems = function(query) {
			return $http.get("https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/systems.xsodata/System?$format=json&$top=15&$filter=startswith(II_SYSTEM_ID, '" + query.toUpperCase() + "')").then(function(response) {
				return response.data.d.results;
			});
		};

		$scope.onSelectSystem = function(item) {
			if(typeof item === "string") {
				if($scope.config.data.systems.indexOf(item) < 0) {
					$scope.config.data.systems.push(item);
				}
			} else {
				if($scope.config.data.systems.indexOf(item.II_SYSTEM_ID) < 0) {
					$scope.config.data.systems.push(item.II_SYSTEM_ID);
				}
			}
		};

		$scope.removeSystem = function(item) {
			$scope.config.data.systems.splice($scope.config.data.systems.indexOf(item), 1);
		};

		$scope.save_click = function ()
		{
			$scope.$emit('closeSettingsScreen');
	    };

        $scope.save_click = function () {
            $scope.$emit('closeSettingsScreen');
        };
}]);
