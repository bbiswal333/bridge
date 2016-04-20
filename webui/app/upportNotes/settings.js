angular.module('app.upportNotes').appUpportNotesSettings = ['$scope', '$http', 'app.upportNotes.configService', 'employeeService', 'lib.utils.calUtils', function ($scope, $http, configService, employeeService, calUtils) {
	var notesConfig = configService.getConfigForAppId($scope.boxScope.metadata.guid);

	$scope.notesConfig = notesConfig;
	$scope.employees = {};

	$scope.createNewConfigItem = function() {
		$scope.bShowSelectionDetails = true;
		$scope.currentConfigValues = notesConfig.getNewItem();
	};

	$scope.searchPrograms = function(query) {
		return $http.get("https://ifp.wdf.sap.corp/zprs/json/program?maxHits=20&query=*" + query + "&sap-language=en&searchAsYouType=X").then(function(response) {
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

    $scope.searchApplicationComponent = function(query) {
		return $http.get("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/components.xsodata/Component?$format=json&$top=10&$filter=startswith(PS_POSID, '" + query.toUpperCase() + "')").then(function(response) {
			return response.data.d.results.map(function(component) { return component.PS_POSID; });
		});
	};

	$scope.onSelectApplicationComponent = function(component) {
    	$scope.currentConfigValues.addApplicationComponent(component);
    };

    $scope.onSelectProcessor = function(value) {
        $scope.currentConfigValues.addProcessor(value.BNAME);
        $scope.currentConfigValues.processor = "";
    };

    $scope.removeProcessor = function(value, configItem) {
        configItem.removeProcessor(value);
    };

	$scope.add_click = function() {
		notesConfig.addItem($scope.currentConfigValues);
		$scope.bShowSelectionDetails = false;
	};

	$scope.loadEmployeeData = function(UserID) {
		employeeService.getData(UserID).then(function(data) {
			$scope.employees[UserID] = data;
		});
	};

	$scope.akhResponsibleSelected = function(responsible) {
		$scope.currentConfigValues.addAKHResponsible(responsible);
	};

	function stopEditMode() {
		$scope.editMode = false;
		$scope.bShowSelectionDetails = false;
		$scope.currentConfigValues = undefined;
	}

	$scope.formatDate = function(oDate) {
		return calUtils.stringifyDate(oDate);
	};

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
