angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', 'notifier', function ($scope, notifier)
    {
        $scope.testNotification = function() {
            notifier.showInfo("This is just a test",
                            "As the title says: nothing to do here :-)",
                            $scope.$parent.module_name,
                            function() {alert('Congratulations!')});
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
});
