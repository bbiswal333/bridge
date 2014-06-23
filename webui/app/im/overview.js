angular.module('app.im', ['ngTable']);

angular.module('app.im').directive('app.im', function () {

    var directiveController = ['$scope' ,'app.im.configservice', function ($scope, appimconfigservice) {  
        $scope.box.boxSize = "1";      
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/im/overview.html',
        controller: directiveController
    };
});

angular.module('app.im').controller('app.im.directiveController', ['$scope', '$http', 'app.im.ticketData',
    function Controller($scope, $http, ticketData) {

        $scope.prios = ticketData.prios;
        $scope.$parent.titleExtension = " - Internal Messages";
        $scope.dataInitialized = ticketData.isInitialized;
        $scope.showNoMessages = false;

        $scope.$watch("prios", function () {
            setNoMessagesFlag();
        }, true);

        function setNoMessagesFlag() {
            if (ticketData.isInitialized.value == true && ($scope.prios[0].amount + $scope.prios[1].amount + $scope.prios[2].amount + $scope.prios[3].amount) == 0) {
                $scope.showNoMessages = true;
            } else {
                $scope.showNoMessages = false;
            }
        };

        if (ticketData.isInitialized.value === false) {
            var initPromise = ticketData.initialize();
            initPromise.then(function success(data) {
                setNoMessagesFlag();
            });
        }

}]);
    
