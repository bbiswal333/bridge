angular.module('app.upportNotes', []);
angular.module('app.upportNotes').directive('app.upportNotes',['app.upportNotes.configService', function (configService) {

	var directiveController = ['$scope', function ($scope) {
		$scope.appText = "Pretty simple app.";

		var appConfig = configService.getConfigForAppId($scope.metadata.guid);
		appConfig.initialize();

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
