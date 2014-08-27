angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', '$window', 'notifier', function ($scope, $window, notifier)
    {
        $scope.testNotification = function() 
        {
            
            /*eslint-disable no-alert */
            notifier.showInfo("This is just a test",
                            "As the title says: nothing to do here :-)",
                            $scope.$parent.module_name,
                            function() {$window.alert('Congratulations!');});
            /*eslint-enable no-alert */            
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
});
