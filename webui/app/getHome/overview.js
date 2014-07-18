angular.module('app.gethome', []);
angular.module('app.gethome').directive('app.gethome', function () {

    var directiveController = ['$scope', function ($scope)
    {
        //put some stuff in here
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/getHome/overview.html',
        controller: directiveController
    };
});
