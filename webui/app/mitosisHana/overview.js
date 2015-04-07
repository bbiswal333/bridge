angular.module('app.mitosisHana', []);

angular.module('app.mitosisHana').directive('app.mitosisHana', ['app.mitosisHana.configService', 'app.mitosisHana.dataService', function (configService, dataService) {

	var directiveController = ['$scope', function ($scope) {

		$scope.box.settingsTitle = "Select Mitosis Contents";
		$scope.box.boxSize = '2';
		$scope.box.settingScreenData = {
			templatePath: "mitosisHana/settings.html",
				controller: angular.module('app.mitosisHana').appMitosisHanaSettings,
				id: $scope.boxId
		};
		$scope.dataService = dataService;

		if (dataService.isInitialized.value === false) {
            dataService.initialize($scope.module_name);
        }

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		$scope.noContentSelected = function() {
			if(!$scope.dataService || $scope.dataService.numberOfContents === 0 ||
				($scope.dataService.contentToDisplay.red.length === 0 && $scope.dataService.contentToDisplay.green.length === 0 && $scope.dataService.contentToDisplay.yellow.length === 0)) {
				return true;
			} else {
				return false;
			}
		};

        $scope.displayContents = function(category){
        	if(category === "red"){
        		$scope.contentToDisplay = dataService.contentToDisplay.red;
        	}
        	else if(category === "yellow"){
        		$scope.contentToDisplay = dataService.contentToDisplay.yellow;
        	}
        	else if(category === "green"){
        		$scope.contentToDisplay = dataService.contentToDisplay.green;
        	}
            $scope.showStatus = true;
        };


		$scope.formatDate = function(date) {
			if(date) {
				var TZOffsetMs = new Date().getTimezoneOffset()*60*1000;
				date = date.replace("/Date(", "");
                date = date.replace(")/", "");
				date = new Date((new Date(parseInt(date,10)).getTime() + TZOffsetMs));

				return date.toDateString() + " " + date.toLocaleTimeString();
			}
			return "";
		};
		// Bridge framework function to take care of refresh
		$scope.box.reloadApp(dataService.getAvailableContents,60 * 5);


	}];

	var linkFn = function ($scope) {
		// get own instance of config service, $scope.appConfig contains the configuration from the backend
		configService.initialize($scope.appConfig);
		dataService.updateContentToDisplay();
	};

	return {
		restrict: 'E',
		templateUrl: 'app/mitosisHana/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
