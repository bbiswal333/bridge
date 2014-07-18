angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', 'notifier', function ($scope, notifier)
    {
        $scope.results = 'Not run so far!';
        $scope.runAllTests = function() {
            $scope.results = 'Running...';
            setTimeout(function(){
                if (!(Math.random()+.5|0)) {
                    notifier.showSuccess("Test Results: ",
                                    "143 of 143 passed.",
                                    $scope.$parent.module_name,
                                    function() {alert('Congratulations!')});
                    $scope.results = '143 tests passed.';
                } else {
                    notifier.showError("Test Results: ",
                                        "12 of 143 failed.",
                                        $scope.$parent.module_name,
                                        function() {alert(':-(')});
                    $scope.results = '12 tests failed.';
                };
            }, 3000);
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
});
