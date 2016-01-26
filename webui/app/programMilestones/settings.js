angular.module('app.programMilestones').appProgramSettings = ['$scope', '$http', 'app.programMilestones.configFactory', 'app.programMilestones.programFactory', '$window', function ($scope, $http, configFactory, programFactory, $window)
{
	var config = configFactory.getConfigForAppId($scope.boxScope.metadata.guid);

	$scope.program = "";

	$scope.programs = config.getPrograms();

	$scope.searchProgram = function(query) {
		return $http.get("https://ifd.wdf.sap.corp/zprs/json/program?maxHits=20&query=*" + query.toUpperCase() + "&sap-language=en&searchAsYouType=X&origin=" + $window.location.origin).then(function(response) {
			return response.data.data.map(function(program) {
				return {
					label: program.DISPLAY_TEXT,
					GUID: program.GUID,
					isSiriusProgram: program.IS_OLD_PROGRAM === "X" ? false : true
				};
			});
		});
	};

	$scope.onSelectProgram = function(item) {
		for(var i = 0, length = $scope.programs.length; i < length; i++) {
			if($scope.programs[i].getGUID() === item.GUID) {
				return;
			}
		}
		if(item === "") {
			return;
		}

		$scope.programs.push(programFactory.createInstance(item.GUID, item.label, item.isSiriusProgram));
	};

	$scope.removeProgram = function(item) {
		$scope.programs.splice($scope.programs.indexOf(item), 1);
	};

	$scope.save_click = function ()
	{
		$scope.$emit('closeSettingsScreen');
    };
}];
