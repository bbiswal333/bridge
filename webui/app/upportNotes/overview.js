angular.module('app.upportNotes', []);
angular.module('app.upportNotes').directive('app.upportNotes',['app.upportNotes.configService', 'app.upportNotes.dataService', function (configService, dataService) {

	var directiveController = ['$scope', function ($scope) {
		var appConfig = configService.getConfigForAppId($scope.metadata.guid);
		appConfig.initialize();
		$scope.config = appConfig;

		var appData = dataService.getDataForAppId($scope.metadata.guid);

		function loadSummary() {
			$scope.loadSummaryPromise = appData.loadSummary().then(function() {
				$scope.summary = appData.summary;
			});
		}

		$scope.$watch("config", function(newValue, oldValue) {
			if(newValue.toJSON() === oldValue.toJSON()) {
				return;
			}

			loadSummary();
		}, true);

		$scope.box.reloadApp(loadSummary, 60 * 5);

		$scope.box.settingScreenData = {
            templatePath: "upportNotes/settings.html",
            controller: angular.module('app.upportNotes').appUpportNotesSettings
        };

        $scope.box.returnConfig = function () {
            return appConfig;
        };
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/upportNotes/overview.html',
		controller: directiveController
	};
}]);
