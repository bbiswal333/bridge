angular.module('app.hydrationMeter', ['app.hydrationMeter.data']);
angular.module('app.hydrationMeter').directive('app.hydrationMeter', ['app.hydrationMeter.configService', 'app.hydrationMeter.dataService', function (configService, dataService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure Test App";
		$scope.box.settingScreenData = {
			templatePath: "hydrationMeter/settings.html",
				controller: angular.module('app.hydrationMeter').appTestSettings,
				id: $scope.boxId
		};
		$scope.box.boxSize = "2";

		$scope.many = dataService.getReloadCounter();
		$scope.values = configService.values;

		$scope.getData = function() {
			dataService.reload();
			$scope.many = dataService.getReloadCounter();
			$scope.values = configService.values;
		};

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		// Bridge framework function to take care of refresh
		$scope.box.reloadApp($scope.getData,60);

		// Example function for notifications
		$scope.testNotification = function() {
			notifier.showInfo("This is just a test",
				"As the title says: nothing to do here :-)",
				$scope.$parent.module_name,
				function() {},
				7000, null); // duration: -1 -> no timout; undefined -> 5000 ms as default
		};

		//Drank another cup
		$scope.drankCups = function(cups) {
			configService.drankCup(cups);
			$scope.getData();
		};

		//reset data
		$scope.resetData = function() {
			configService.resetData();
			$scope.getData();
		};
	}];

	var linkFn = function ($scope) {

		// get own instance of config service, $scope.appConfig contains the configuration from the backend
		configService.initialize($scope.appConfig);

		// watch on any changes in the settings screen
		$scope.$watch("appConfig.values.currentCups", function () {
			$scope.box.currentCups = $scope.appConfig.values.currentCups;
		}, true);
		// watch on any changes in the settings screen
		$scope.$watch("appConfig.values.targetCups", function () {
			$scope.box.targetCups = $scope.appConfig.values.targetCups;
		}, true);
	};

	return {
		restrict: 'E',
		templateUrl: 'app/hydrationMeter/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
