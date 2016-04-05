angular.module('app.cats', ["lib.utils", "app.cats.dataModule", "app.cats.utilsModule", "ngRoute", "bridge.service"]);

angular.module("app.cats").directive("app.cats", ["app.cats.configService",
	function (catsConfigService) {
		var controller = ['$scope', function ($scope) {

			$scope.box.boxSize = "2";
			catsConfigService.box = $scope.box;
			$scope.configService = catsConfigService;
			$scope.variableThatIsFalse = false;

			$scope.box.settingsTitle = "Configure Work List";
			$scope.box.settingScreenData = {
				templatePath: "cats/settings.html",
				controller: angular.module('app.cats').catsSettings,
				id: $scope.boxId
			};

			$scope.getCatClass = function(){
				$scope.catClass = Math.floor(Math.random() * 2);
			};
		}];

		return {
			restrict: "E",
			controller: controller,
			templateUrl: "app/cats/overview.html",
			link: function ($scope)
			{
				catsConfigService.copyConfigIfLoaded($scope.appConfig);
			}
		};
}]);
