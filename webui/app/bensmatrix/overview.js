angular.module('app.bensmatrix', ['app.bensmatrix.data']);
angular.module('app.bensmatrix').directive('app.bensmatrix', ['app.bensmatrix.configService', 'app.bensmatrix.dataService', function (configService, dataService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure";
		$scope.box.sSize = 2;
		$scope.family = "Arial,Helvetica,sans-serif";
		$scope.size = "14pt";
		$scope.weight = "400";
		$scope.style = "normal";
		$scope.variant = "normal";
		$scope.languages = [ {
			value : 'English',
			label : 'en-US'
		}, {
			value : 'German',
			label : 'de-DE'
		}];

		$scope.selectedSourceLanguage = $scope.languages[0];
		$scope.box.settingScreenData = {
			templatePath: "bensmatrix/settings.html",
				controller: angular.module('app.bensmatrix').appbensmatrixSettings,
				id: $scope.boxId
		};

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
			notifier.showInfo("This is just Ben's matrix",
				"As the title says: nothing to do here :-)",
				$scope.$parent.module_name,
				function() {},
				7000, null); // duration: -1 -> no timout; undefined -> 5000 ms as default
		};

		$scope.updateLength = function (){
			var sInput = $scope.input;
			if (sInput === undefined || sInput.length < 1) {
				return;
			}
			var enlength = sInput.length;
			var tlength;
			var selectedLanguage = $scope.selectedSourceLanguage.label;

			if(selectedLanguage === "en-US"){
				//Matrix for en-US
				if ( enlength >= 1 && enlength <= 4) 	{ tlength = 10; }
				else if (enlength === 5) 	{ tlength = 14; }
				else if (enlength === 6) 	{ tlength = 16; }
				else if (enlength === 7) 	{ tlength = 18; }
				else if (enlength >= 8 && enlength <= 10) 	{ tlength = 20; }
				else if (enlength === 11) 	{ tlength = 22; }
				else if (enlength === 12) 	{ tlength = 24; }
				else if (enlength >= 13 && enlength <= 15) 	{ tlength = 26; }
				else if (enlength === 16) 	{ tlength = 28; }
				else if (enlength >= 17 && enlength <= 20) 	{ tlength = 32; }
				else if (enlength >= 21 && enlength <= 80) 	{ tlength = Math.round( ( enlength + enlength / 100 * 50 )); }
				else { tlength = Math.round( ( enlength + enlength / 100 * 30 ) ); }
			} else if (selectedLanguage === "de-DE") {
				//Matrix for de-DE
				if ( enlength >= 1 && enlength <= 4) 	{ tlength = 10; }
				else if (enlength === 5) 	{ tlength = 16; }
				else if (enlength === 6) 	{ tlength = 18; }
				else if (enlength === 7) 	{ tlength = 20; }
				else if (enlength >= 8 && enlength <= 10) 	{ tlength = 20; }
				else if (enlength >= 11 && enlength <= 15) 	{ tlength = 26; }
				else if (enlength === 16) 	{ tlength = 28; }
				else if (enlength >= 17 && enlength <= 20) 	{ tlength = 30; }
				else if (enlength >= 21 && enlength <= 80) 	{ tlength = Math.round( ( enlength + enlength / 100 * 50 )); }
				else { tlength = Math.round( ( enlength + enlength / 100 * 30 ) ); }
			}
			var emlength = Math.round((tlength * 2) / 3);

			$scope.emlength = emlength;
			$scope.slength = enlength;
			$scope.tlength = tlength;

			//set text to dummy span to get the pixels
			var elDummy = angular.element("#dummySpan");
			elDummy.html(sInput);
			//var pxlength = elDummy.getBoundingClientRect().width;
			$scope.pxlength = Math.round($(elDummy).width());
			$scope.output = sInput;

	};

	$scope.getStyle = function(){
		return {
			"font-family" : $scope.family,
			"font-size" : $scope.size,
			"font-weight" : $scope.weight,
			"font-style" : $scope.style,
			"font-variant" : $scope.variant
		};

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
