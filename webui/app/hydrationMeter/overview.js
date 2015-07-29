﻿angular.module('app.hydrationMeter', []);
angular.module('app.hydrationMeter').directive('app.hydrationMeter', ['app.hydrationMeter.configService', function (configService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Set configurations";
		$scope.box.settingScreenData = {
			templatePath: "hydrationMeter/settings.html",
				controller: angular.module('app.hydrationMeter').appTestSettings
		};
		$scope.box.boxSize = "2";

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
			"You can do it! Go for it",
			"Champion!",
			"Don't drink too much, you might get a tummy ache!"
		];
		$scope.message = $scope.messages[0];

		$scope.addNotification = function() {
			if ($scope.canNotify()) {
				notifier.showInfo(
					"Psssst, It's been a while you didn't drink water!",
					"Aren't you feeling dehydrated? You only drank " + $scope.values.currentCups + " cups so far today. How about you go get yourself another one?",
					$scope.$parent.module_name, function() {}, 5000, null);
			};

		};

		$scope.canNotify = function() {
			if ($scope.values.notify == false) {
				return false;
			};
			return true;
		}
		
		$scope.getData = function() {
			$scope.values = configService.values;
			$scope.calculateRating();
			$scope.updateMessage();
			$scope.addNotification();
		};

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function() {
			return angular.copy(configService);
		};

		// Bridge framework function to take care of refresh
		$scope.box.reloadApp($scope.getData,60);

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
