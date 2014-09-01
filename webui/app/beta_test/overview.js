angular.module('app.betatest', []);
angular.module('app.betatest').directive('app.betatest', function () {

    var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier)
    {
           //it would be okay for non beta testers to include a syntax error here as the angular module is not loaded and just the script tag is included
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/beta_test/overview.html',
        controller: directiveController
    };
});
