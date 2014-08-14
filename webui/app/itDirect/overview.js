angular.module('app.itdirect', ['ngTable']);

angular.module('app.itdirect').directive('app.itdirect', [function ()
{
    var directiveController = function(){

    };

    return {
        restrict: 'E',
        templateUrl: 'app/itdirect/overview.html',
        controller: directiveController
    };
}]);