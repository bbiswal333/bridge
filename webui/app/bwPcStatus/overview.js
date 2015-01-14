angular.module('app.bwPcStatus', ['app.bwPcStatus.data']);
angular.module('app.bwPcStatus').directive('app.bwPcStatus', ['app.bwPcStatus.configService', 'app.bwPcStatus.dataService', function (configService, dataService) {

	var directiveController = ['$scope', function ($scope) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure your BW Process Chain Status App";
		$scope.search = {};
		$scope.box.settingScreenData = {
			templatePath: "bwPcStatus/settings.html",
				controller: angular.module('app.bwPcStatus').appPcStatusSettings,
				id: $scope.boxId
		};

		$scope.getData = function() {
			dataService.getChainStatus().then(function() {
				$scope.values =  dataService.data.statusObject;
			});
		};

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		$scope.displayDetails = function(status) {
			dataService.data.search.ANALYZED_STATUS = status;
		};

		$scope.$on('closeSettingsScreenRequested', function(event, args){
           if (args !== undefined && args.app === 'bwPcStatus'){
               $scope.getData();
           }
        });

		if(dataService.data.statusObject  === undefined ) {
			$scope.getData();
		}
		else {
			$scope.values =  dataService.data.statusObject;
		}

		$scope.box.reloadApp($scope.getData, 60 * 15);

	}];

	var linkFn = function ($scope) {

		// get own instance of config service, $scope.appConfig contains the configuration from the backend
		configService.initialize($scope.appConfig);

		dataService.getContents();

		// watch on any changes in the settings screen
		$scope.$watch("appConfig.values.boxSize", function () {
			$scope.box.boxSize = $scope.appConfig.values.boxSize;
		}, true);
	};

	return {
		restrict: 'E',
		templateUrl: 'app/bwPcStatus/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
