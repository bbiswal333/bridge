angular.module('app.bensmatrix', ['app.bensmatrix.data']);
angular.module('app.bensmatrix').directive('app.bensmatrix', ['app.bensmatrix.configService', 'app.bensmatrix.dataService', function (configService, dataService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		//$scope.box.settingsTitle = "Configure bensmatrix App";
		$scope.box.sSize = 2;
		/*$scope.box.settingScreenData = {
			templatePath: "bensmatrix/settings.html",
				controller: angular.module('app.bensmatrix').appbensmatrixSettings,
				id: $scope.boxId
		};*/

		$scope.many = dataService.getReloadCounter();

		$scope.getData = function() {
			dataService.reload();
			$scope.many = dataService.getReloadCounter();
		};

		// Bridge framework function to enable saving the config
		/*
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};
		*/
		// Bridge framework function to take care of refresh
		$scope.box.reloadApp($scope.getData,60);

		// Example function for notifications
		$scope.bensmatrixNotification = function() {
			notifier.showInfo("This is just a bensmatrix",
				"As the title says: nothing to do here :-)",
				$scope.$parent.module_name,
				function() {},
				7000, null); // duration: -1 -> no timout; undefined -> 5000 ms as default
		};

		$scope.updatePixels = function () {
			var pxlength = angular.element("output").getBoundingClientRect().width;
			angular.element("pxlength").innerHTML = Math.round(pxlength);
		};

		$scope.updateLength = function (){
			var sInput = angular.element("input").value;
			var enlength = angular.element("input").value.length;
			var tlength;
			if ( enlength >= 1 && enlength <= 4) 	{ tlength = 10; }
			else if (enlength >= 5 && enlength <= 10) 	{ tlength = 20; }
			else if (enlength >= 11 && enlength <= 15) 	{ tlength = 25; }
			else if (enlength >= 16 && enlength <= 20) 	{ tlength = 30; }
			else if (enlength >= 21 && enlength <= 80) 	{ tlength = Math.round( ( enlength + enlength / 100 * 50 )); }
			else { tlength = Math.round( ( enlength + enlength / 100 * 30 ) ); }
			var emlength = Math.round((tlength * 2) / 3);

			angular.element("emlength").innerHTML = emlength;
			angular.element("slength").innerHTML = enlength;
			angular.element("tlength").innerHTML = tlength;

			var sFamily = angular.element("family").value;
			angular.element("output").style.fontFamily = sFamily;

			var sSize = angular.element("size").value;
			angular.element("output").style.fontSize = sSize;

			var sWeight = angular.element("weight").value;
			angular.element("output").style.fontWeight = sWeight;

			var sStyle = angular.element("style").value;
			angular.element("output").style.fontStyle = sStyle;

			var sVariant = angular.element("variant").value;
			angular.element("output").style.fontVariant = sVariant;

			angular.element("output").innerHTML = sInput;
	};

	}];

	var linkFn = function ($scope) {

		// get own instance of config service, $scope.appConfig contains the configuration from the backend
		configService.initialize($scope.appConfig);

		// watch on any changes in the settings screen
		$scope.$watch("appConfig.values.boxSize", function () {
			$scope.box.boxSize = $scope.appConfig.values.boxSize;
		}, true);
	};

	return {
		restrict: 'E',
		templateUrl: 'app/bensmatrix/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);


