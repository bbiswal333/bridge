angular.module('app.bensmatrix', ['app.bensmatrix.data']);
angular.module('app.bensmatrix').directive('app.bensmatrix', ['app.bensmatrix.configService', 'app.bensmatrix.dataService', function (configService, dataService) {

	var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier) {

		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure bensmatrix App";
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
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

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

	var updateLength = function ($scope){
		var enlength = document.getElementById("input").value.length ;
		var tlength;
		var c_bracket_count = 3;
		
		if ( enlength >= 1 && enlength <= 4) 	{ tlength = 10;}
		else if (enlength >= 5 && enlength <= 10) 	{ tlength = 20;}
		else if (enlength >= 11 && enlength <= 15) 	{ tlength = 25;}
		else if (enlength >= 16 && enlength <= 20) 	{ tlength = 30;}
		else if (enlength >= 21 && enlength <= 80) 	{ tlength = Math.round( ( enlength + enlength / 100 * 50 ));}
		else { tlength = Math.round( ( enlength + enlength / 100 * 30 ) );}
		
		document.getElementById("slength").innerHTML = enlength;
		document.getElementById("tlength").innerHTML = tlength;
};
