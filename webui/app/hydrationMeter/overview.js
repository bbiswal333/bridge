angular.module('app.hydrationMeter', []);
angular.module('app.hydrationMeter').directive('app.hydrationMeter', ['app.hydrationMeter.configService', function (configService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Set configurations";
		$scope.box.settingScreenData = {
			templatePath: "hydrationMeter/settings.html",
				controller: angular.module('app.hydrationMeter').appTestSettings
		};
		$scope.box.boxSize = "1";

		$scope.values = configService.values;
		$scope.defaultColor = "red-font";
		$scope.defaultSize = "";
		$scope.rating = {};
		$scope.rating.color = $scope.defaultColor;
		$scope.rating.size = $scope.defaultSize;
		var noWaterYetMessage =	"You didn't drink anything... what happened?";
		$scope.messages = [
			"Glad you started drinking, how do you feel now?",
			"You can do it! Go for it.",
			"Half way there! You go, buddy ;-)",
			"Almost there! Just a few cups more to go.",
			"Champion!",
			"Don't drink too much, you might get a tummy ache!"
		];
		$scope.message = noWaterYetMessage;

		$scope.addNotification = function() {
			if ($scope.canNotify()) {
				var msg = "How about you go get yourself a cup?";
				if( $scope.values.currentCups < 3 && $scope.values.currentCups > 0) {
					msg = "Aren't you feeling dehydrated? You only drank " + $scope.values.currentCups + " cups so far today. How about you go get yourself another one?";
				}
				if( $scope.values.currentCups === 0 ) {
					msg = "Aren't you feeling dehydrated? You haven't drank any water today yet. How about you go get yourself a cup?";
				}
				notifier.showInfo(
					"Psssst, It's been a while you didn't drink water!",
					msg,
					$scope.$parent.module_name, function() {}, 5000, null);
			}

		};

		$scope.canNotify = function() {
			if ($scope.values.notify === false) {
				return false;
			} else if ( ( $scope.values.lastTimeDrank + (2 * 60 * 60 * 1000) ) <= ( new Date() ).getTime()) {
				$scope.values.lastTimeDrank = ( new Date() ).getTime();
				return true;
			}
		};

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
			if ($scope.values.currentCups === 0) {
				percentage = 0;
			}
			return percentage;
		};

		$scope.calculateRating = function() {
			var percentage = $scope.getPercentage();
			if ( percentage > 100 ) {
				$scope.rating.color = "green-font fa-flip-vertical";
				$scope.rating.size = "fa-4x";
			} else if ( percentage >= 75 ) {
				$scope.rating.color = "basic-blue-font";
				$scope.rating.size = "fa-3x";
			} else if ( percentage >= 40 ) {
				$scope.rating.color = "orange-font";
				$scope.rating.size = "fa-2x";
			} else {
				$scope.rating.color = $scope.defaultColor;
				$scope.rating.size = $scope.defaultSize;
			}
		};

		$scope.getCupStyle = function() {
			return "fa fa-glass " + $scope.rating.size + " " + $scope.rating.color;
		};

		$scope.updateMessage = function() {
			var percentage = $scope.getPercentage();
			var position = Math.round( $scope.messages.length * percentage / 100 ) - 1;
			if (position < 0) {
				$scope.message = noWaterYetMessage;
			} else if ( position >= $scope.messages.length) {
				$scope.message = $scope.messages[$scope.messages.length - 1];
			} else {
				$scope.message = $scope.messages[position];
			}
		};
		$scope.getMessage = function() {
			return $scope.message + " You drank " + $scope.values.currentCups + " cups so far.";
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
