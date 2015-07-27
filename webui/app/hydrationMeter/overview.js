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
		$scope.defaultColor = "red-font";
		$scope.defaultSize = "";
		$scope.rating = {};
		$scope.rating.color = $scope.defaultColor;
		$scope.rating.size = $scope.defaultSize;
		$scope.messages = [
			"You didn't drink anything... what happened?",
			"Glad you started drinking, how do you feel now?",
			"Half way there! You go, buddy ;-)",
			"You can do it! Go for it {{userName}}",
			"Champion!",
			"Don't drink too much, you might get a tummy ache!"
		];
		$scope.message = $scope.messages[0];

		$scope.getData = function() {
			dataService.reload();
			$scope.many = dataService.getReloadCounter();
			$scope.values = configService.values;
			$scope.calculateRating();
			$scope.updateMessage();
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

		$scope.getPercentage = function() {
			var percentage = ($scope.values.currentCups * 100) / $scope.values.targetCups;
			if ($scope.values.currentCups == 0) {
				percentage = 0;
			};
			return percentage;
		};

		$scope.calculateRating = function() {
			var percentage = $scope.getPercentage();
			if ( percentage > 100 ) {
				$scope.rating.color = "green-font fa-flip-vertical";
				$scope.rating.size = "fa-3x";
			} else if ( percentage >= 85 ) {
				$scope.rating.color = "basic-blue-font";
				$scope.rating.size = "fa-2x";
			} else if ( percentage >= 50 ) {
				$scope.rating.color = "orange-font";
				$scope.rating.size = "fa-lg";
			} else {
				$scope.rating.color = $scope.defaultColor;
				$scope.rating.size = $scope.defaultSize;
			};
		};

		$scope.getCupStyle = function() {
			return "fa fa-glass " + $scope.rating.size + " " + $scope.rating.color;
		};

		$scope.updateMessage = function() {
			var percentage = $scope.getPercentage();
			var position = Math.round( $scope.messages.length * percentage / 100 ) - 1;
			if (position < 0) {
				position = 0;
			} else if ( position >= $scope.messages.length) {
				position = $scope.messages.length - 1;
			};
			$scope.message = $scope.messages[position];
		};
		$scope.getMessage = function() {
			return $scope.message;
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
		$scope.calculateRating();
	};

	return {
		restrict: 'E',
		templateUrl: 'app/hydrationMeter/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
