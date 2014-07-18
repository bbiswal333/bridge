angular.module('app.getHome', []);
angular.module('app.getHome').directive('app.getHome', function () {

    var directiveController = ['$scope', function ($scope)
    {
    	$scope.box.boxSize = "1";
        $scope.box.settingScreenData = {
            templatePath: "getHome/settings.html",
            controller: angular.module('app.getHome').appGetHomeSettings
        };        
        $scope.config = appGetHomeConfig;

        //put some stuff in here
			$scope.locations = [ {
			name : "Work",
			address : "Dietmar-Hopp-Allee, Walldorf",
			lat : "10",
			alt : "48"
		}, {
			name : "Home",
			address : "Kaiserstraße, Karlsruhe",
			lat : "9",
			alt : "49"
		} ];

		$scope.from = $scope.locations[0];
		$scope.to = $scope.locations[1];

		$scope.delay_string = "40min (+16min)";
        nokia.Settings.set("app_id", "BGFtzY6olMoTQcTu9MGp");
		nokia.Settings.set("app_code", "pbI1l9jZBzUsw0pouKowHA");

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/getHome/overview.html',
        controller: directiveController
    };
});
