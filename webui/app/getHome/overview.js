angular.module('app.getHome', []);
angular.module('app.getHome').directive('app.getHome', function () {

    var directiveController = ['$scope', function ($scope)
    {
        //put some stuff in here

        nokia.Settings.set("app_id", "BGFtzY6olMoTQcTu9MGp");
		nokia.Settings.set("app_code", "pbI1l9jZBzUsw0pouKowHA");

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/getHome/overview.html',
        controller: directiveController
    };
});
