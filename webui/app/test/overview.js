﻿angular.module('app.test', []);
angular.module('app.test').directive('app.test', function () {

    var directiveController = ['$scope', 'notifier', function ($scope, notifier)
    {
        $scope.results = 'Not run so far!';
        $scope.runAllTests = function() {
            $scope.results = 'Running...';
            setTimeout(function(){
                if (!(Math.random()+.5|0)) {
                    notifier.showSuccess("Test Results: ", 
                                    "1 of 143 passed.", 
                                    $scope.$parent.module_name, 
                                    function() {alert('Congratulations!')});
                    $scope.results = '1 tests passed.';
                    notifier.showError("Test : ", 
                                        "2 of 143 failed.", 
                                        $scope.$parent.module_name, 
                                        function() {alert(':--(')});

                    notifier.showError("aasd : ", 
                                        "adesc.", 
                                        "aasd", 
                                        function() {alert(':--(')});
                    $scope.results = '2 tests passed.';
                } else {
                    notifier.showError("Test Results: ", 
                                        "10 of 143 failed.", 
                                        $scope.$parent.module_name, 
                                        function() {alert(':-(')});
                    $scope.results = '10 tests failed.';    
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
