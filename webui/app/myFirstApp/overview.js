angular.module("app.myFirstApp", ["app.myFirstApp.data"]);
angular.module("app.myFirstApp").directive(
	"app.myFirstApp", 
	[
		"app.myFirstApp.configService", "app.myFirstApp.dataService", 
		function (configService, dataService) {

			var directiveController = ["$scope", function ($scope) {
		
				// Required information to get settings icon/ screen
				$scope.box.settingsTitle = "Configure dict.cc app";
				$scope.box.settingScreenData = {
					templatePath: "myFirstApp/settings.html",
						controller: angular.module("app.myFirstApp").appTestSettings,
						id: $scope.boxId
				};
		
				// Bridge framework function to enable saving the config
				$scope.box.returnConfig = function(){
					return angular.copy(configService);
				};
		
				$scope.saveUserInput = function() {
					dataService.setData($scope.input);
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
				restrict: "E",
				templateUrl: "app/myFirstApp/overview.html",
				controller: directiveController,
				link: linkFn
			};
		}
	]
);
