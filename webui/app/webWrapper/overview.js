angular.module("app.webWrapper", ["app.webWrapper.data"]);
angular.module("app.webWrapper").directive(
	"app.webWrapper",
	[
		"app.webWrapper.configService",
		"app.webWrapper.dataService",

		function (configService, dataService) {

			var controller = ["$scope", function ($scope) {

				// Required information to get settings icon/ screen
				$scope.box.settingsTitle = "Configure web request";
				$scope.box.settingScreenData = {
					templatePath: "webWrapper/settings.html",
					controller: angular.module("app.webWrapper").appWebWrapperSettings,
					id: $scope.boxId
				};

				// Bridge framework function to enable saving the config
				$scope.box.returnConfig = function(){
					return angular.copy(configService);
				};

				$scope.saveUserInput = function() {
					dataService.setInput($scope.input);
					dataService.setUrl($scope.configUrl);
				};

			}];

			var linkFn = function ($scope) {

				// get own instance of config service, $scope.appConfig contains the configuration from the backend
				configService.initialize($scope.appConfig);

				// watch on any changes in the settings screen
				$scope.$watch("appConfig.values.boxSize", function () {
					$scope.box.boxSize = $scope.appConfig.values.boxSize;
				}, true);

				$scope.$watch("appConfig.values.boxTitle", function () {
					$scope.boxTitle = $scope.appConfig.values.boxTitle;
				}, true);

				$scope.$watch("appConfig.values.url", function () {
					$scope.configUrl = $scope.appConfig.values.url;
				}, true);

				$scope.$watch("appConfig.values.buttonTitle", function () {
					$scope.buttonTitle = $scope.appConfig.values.buttonTitle;
				}, true);

			};

			return {
				restrict: "E",
				templateUrl: "app/webWrapper/overview.html",
				controller: controller,
				link: linkFn
			};
		}
	]
);
