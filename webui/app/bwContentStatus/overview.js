angular.module('app.bwContentStatus', ['app.bwContentStatus.data']);
angular.module('app.bwContentStatus').directive('app.bwContentStatus', [function () {

	var directiveController = ['$scope', 'app.bwContentStatus.configService', 'app.bwContentStatus.dataService', function ($scope, configService, dataService) {

		$scope.box.boxSize = 2;

		configService.initialize($scope.metadata.guid);

		dataService.getContents();

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure your BW Content Status App";
		$scope.showDetails = false;
		$scope.search = {};
		$scope.box.settingScreenData = {
			templatePath: "bwContentStatus/settings.html",
				controller: angular.module('app.bwContentStatus').appContentStatusSettings,
				id: $scope.boxId
		};

		$scope.getData = function() {
			if($scope.appConfig.values === undefined) {
				$scope.values = [];
				$scope.values.assigned = 0;
			} else {
				dataService.getContentStatus($scope.appConfig.values.contents).then(function() {
					$scope.values   =  dataService.data.statusObject;
					$scope.contents =  dataService.data.contents;
				});
			}
		};

		$scope.setStatus = function(content, status) {
			if (status === 1 && status !== content.STATUS) {
				content.CNT_COMMENT = 'Content up-to-date';
			}
			dataService.setContentStatus(content, status).then(function() {
				$scope.getData();
			});
		};

		$scope.displayDetails = function(status) {
			$scope.showDetails = true;
			$scope.search.STATUS = status;
		};

		$scope.$on('closeSettingsScreenRequested', function(event, args){
           if (args !== undefined && args.app === 'bwContentStatus'){
               $scope.getData();
           }
        });

		$scope.getData();
		$scope.box.reloadApp($scope.getData, 60 * 5);

	}];

	return {
		restrict: 'E',
		templateUrl: 'app/bwContentStatus/overview.html',
		controller: directiveController
	};
}]);
