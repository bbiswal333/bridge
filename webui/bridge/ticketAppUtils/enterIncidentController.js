angular.module("bridge.ticketAppUtils").controller("bridge.ticketAppUtils.enterIncidentsController", ["$scope", "$window", function($scope, $window){
    $scope.go_click = function(sId){
        $window.open("https://support.wdf.sap.corp/sap/support/message/" + sId);
    };

    $scope.input_keypress = function($event){
        if ($event.keyCode === 13){
            $scope.go_click($scope.enteredId);
        }
    };

}]);
