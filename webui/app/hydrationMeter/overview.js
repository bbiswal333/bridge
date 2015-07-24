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
		$scope.rating = "red";

		$scope.getData = function() {
			dataService.reload();
			$scope.many = dataService.getReloadCounter();
			$scope.values = configService.values;
			$scope.calculateRating($scope.values.targetCups, $scope.values.currentCups);
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

		$scope.calculateRating = function(target, current) {
			var percentage = (current * 100) / target;
			if ( percentage >= 100 ) {
				$scope.rating = "green-60";
			} else if ( percentage >= 85 ) {
				$scope.rating = "basic-blue-60";
			} else if ( percentage >= 50 ) {
				$scope.rating = "orange-60";
			} else if ( percentage < 50 || current == 0 ) {
				$scope.rating = "red-60";
			} else {
				$scope.rating = "red-60";
			};
		};

		$scope.getRating = function() {
			return $scope.rating;
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
		$scope.calculateRating($scope.appConfig.values.targetCups, $scope.appConfig.values.currentCups);
	};

	return {
		restrict: 'E',
		templateUrl: 'app/hydrationMeter/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
