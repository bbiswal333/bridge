angular.module('app.bwPcStatus', ['app.bwPcStatus.data']);
angular.module('app.bwPcStatus').directive('app.bwPcStatus', [function () {

	var directiveController = ['$scope', 'app.bwPcStatus.configService', 'app.bwPcStatus.dataService', function ($scope, configService, dataService) {

		$scope.box.boxSize = 2;

		configService.initialize($scope.metadata.guid);

		dataService.getContents();

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

	return {
		restrict: 'E',
		templateUrl: 'app/bwPcStatus/overview.html',
		controller: directiveController
	};
}]);
