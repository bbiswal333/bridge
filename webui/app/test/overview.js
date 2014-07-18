angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', 'notifier', function ($scope, notifier)
    {
        //put some stuff in here
        notifier.showInfo("Meetings", "You have new meetings", "MeetingsApp");
        console.log(notifier.allNotifications());

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
});
