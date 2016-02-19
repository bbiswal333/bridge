angular.module('app.transportNew').appTransportSettings = ['$scope', '$http', 'app.transportNew.configService', function ($scope, $http, configService)
{
	var transportConfig = configService.getInstanceForAppId($scope.boxScope.metadata.guid);

	$scope.component = "";
	$scope.owner = "";
	$scope.system = "";

	$scope.currentConfigValues = transportConfig;

	$scope.searchComponent = function(query) {
		return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_COMPONENTS?query=" + query.toUpperCase() + "*").then(function(response) {
			return response.data.COMPONENTS;
		});
	};

	$scope.onSelectComponent = function(item) {
		for(var i = 0, length = $scope.currentConfigValues.components.length; i < length; i++) {
			if($scope.currentConfigValues.components[i].value === item) {
				return;
			}
		}
		if(item === "") {
			return;
		}

		$scope.currentConfigValues.components.push({exclude: false, value: item});
	};

	$scope.removeComponent = function(item) {
		$scope.currentConfigValues.components.splice($scope.currentConfigValues.components.indexOf(item), 1);
	};

	$scope.onSelectSystem = function(item) {
		for(var i = 0, length = $scope.currentConfigValues.systems.length; i < length; i++) {
			if($scope.currentConfigValues.systems[i].value === item) {
				return;
			}
		}
		if(item === "") {
			return;
		}

		$scope.currentConfigValues.systems.push({exclude: false, value: item});
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

		$scope.owner = {};
	};

	$scope.removeOwner = function(item) {
		$scope.currentConfigValues.owners.splice($scope.currentConfigValues.owners.indexOf(item), 1);
	};

	$scope.save_click = function ()
	{
		$scope.$emit('closeSettingsScreen');
    };
}];
