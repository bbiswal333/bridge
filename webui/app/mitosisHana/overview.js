angular.module('app.mitosisHana', []);

angular.module('app.mitosisHana').directive('app.mitosisHana', ['app.mitosisHana.configService', 'app.mitosisHana.dataService', '$window' , function (configService, dataService, $window) {

	var directiveController = ['$scope', function ($scope) {

		$scope.box.settingsTitle = "Available Contents:";
		$scope.box.boxSize = '2';
		$scope.box.settingScreenData = {
			templatePath: "mitosisHana/settings.html",
				controller: angular.module('app.mitosisHana').appMitosisHanaSettings,
				id: $scope.boxId
		};
		$scope.box.headerIcons = [{
            iconCss: "fa-bug",
            title: "Report Issue",
            callback: function(){
                $window.open("https://itdirect.wdf.sap.corp/sap(bD1lbiZjPTAwMSZkPW1pbg==)/bc/bsp/sap/crm_ui_start/default.htm?sapsessioncmd=open&saprole=ZITSERVREQU&crm-object-type=AIC_OB_INCIDENT&crm-object-action=D&PROCESS_TYPE=ZINE&CAT_ID=IMFIT_TOOLS_DRT&DESCRIPTION=MIT%20Content%20Load%20Status");
            }
        }];

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
				var TZOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
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
