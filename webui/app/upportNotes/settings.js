angular.module('app.upportNotes').appUpportNotesSettings = ['$scope', '$http', 'app.upportNotes.configService', function ($scope, $http, configService) {
	var notesConfig = configService.getConfigForAppId($scope.boxScope.metadata.guid);

	$scope.notesConfig = notesConfig;

	$scope.createNewConfigItem = function() {
		$scope.bShowSelectionDetails = true;
		$scope.currentConfigValues = notesConfig.getNewItem();
	};

	$scope.searchPrograms = function(query) {
		return $http.get("https://ifd.wdf.sap.corp/zprs/json/program?maxHits=20&query=*" + query + "&sap-language=en&searchAsYouType=X").then(function(response) {
			return response.data.data;
		});
	};

	$scope.onSelectProgram = function(program) {
		$scope.currentConfigValues.addProgram(program.GUID, program.DISPLAY_TEXT);
	};

	$scope.searchSoftwareComponent = function(query) {
        return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_SOFTWARE_COMPONENTS?query=" + query.toUpperCase() + "*").then(function(response) {
            return response.data.COMPONENTS;
        });
    };

    $scope.onSelectSoftwareComponent = function(component) {
    	$scope.currentConfigValues.addSoftwareComponent(component);
    };

	$scope.add_click = function() {
		notesConfig.addItem($scope.currentConfigValues);
		$scope.bShowSelectionDetails = false;
	};

	function stopEditMode() {
		$scope.editMode = false;
		$scope.bShowSelectionDetails = false;
		$scope.currentConfigValues = undefined;
	}

	$scope.save_click = function() {
		$scope.currentConfigValues.applyChanges();
		stopEditMode();
	};

	$scope.edit_click = function(configItem) {
		$scope.bShowSelectionDetails = true;
		$scope.editMode = true;
		$scope.currentConfigValues = configItem.startEditing();
	};

	$scope.cancel_click = function() {
		stopEditMode();
	};

	$scope.closeForm = function () {
        $scope.$emit('closeSettingsScreen');
    };
}];
