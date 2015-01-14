angular.module('app.bwContentStatus', ['app.bwContentStatus.data']);
angular.module('app.bwContentStatus').directive('app.bwContentStatus', ['app.bwContentStatus.configService', 'app.bwContentStatus.dataService', function (configService, dataService) {

	var directiveController = ['$scope', function ($scope) {

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

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
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
		templateUrl: 'app/bwContentStatus/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
