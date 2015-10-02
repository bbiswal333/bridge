angular.module('app.transportNew').appTransportSettings = ['$scope', '$http', 'app.transportNew.configService', function ($scope, $http, configService)
{
	var transportConfig = configService.getInstanceForAppId($scope.boxScope.metadata.guid);

	$scope.component = "";
	$scope.owner = "";
	$scope.system

	$scope.currentConfigValues = transportConfig;

	$scope.searchComponent = function(query) {
		return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_COMPONENTS?query=" + query.toUpperCase() + "*").then(function(response) {
			return response.data.COMPONENTS;
		});
	};

	$scope.onSelectComponent = function(item) {
		if($scope.currentConfigValues.components.indexOf(item) < 0) {
			$scope.currentConfigValues.components.push(item);
		}
	};

	$scope.removeComponent = function(item) {
		$scope.currentConfigValues.components.splice($scope.currentConfigValues.components.indexOf(item), 1);
	};

	$scope.onSelectSystem = function(item) {
		if($scope.currentConfigValues.systems.indexOf(item) < 0) {
			$scope.currentConfigValues.systems.push(item);
		}
	};

	$scope.removeSystem = function(item) {
		$scope.currentConfigValues.systems.splice($scope.currentConfigValues.systems.indexOf(item), 1);
	};

	$scope.onSelectEmployee = function(owner) {
		for(var i = 0; i < $scope.currentConfigValues.owners.length; i++) {
			if($scope.currentConfigValues.owners[i].selector === owner.BNAME + ";" + owner.SAPNA) {
				return;
			}
		}

		$scope.currentConfigValues.owners.push({
			label: owner.VORNA + " " + owner.NACHN,
			selector: owner.BNAME + ";" + owner.SAPNA
		});
	};

	$scope.removeOwner = function(item) {
		$scope.currentConfigValues.owners.splice($scope.currentConfigValues.owners.indexOf(item), 1);
	};

	$scope.save_click = function ()
	{
		$scope.$emit('closeSettingsScreen');
    };
}];
