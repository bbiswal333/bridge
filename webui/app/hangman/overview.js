angular.module('app.hangman', []);
angular.module('app.hangman').directive('app.hangman', function () {

    var directiveController = ['$scope', 'notifier', function ($scope, notifier)
    {
        $scope.numNotifications = notifier.allNotifications().length;
        
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/hangman/overview.html',
        controller: directiveController
    };
});
