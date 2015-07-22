angular.module("bridge.ticketAppUtils").controller("bridge.ticketAppUtils.enterIncidentsController", ["$scope", "$window", function($scope, $window){
    $scope.go_click = function(sId){
        sId.replace('/[^0-9]/', "");
        //$window.open("https://support.wdf.sap.corp/sap/support/message/" + sId);
        $window.open("http://ims2crm1.wdf.sap.corp:1080/ngcss/index.php?ref=2&incident=" + sId);
    };

    $scope.input_keypress = function($event){
        if ($event.keyCode === 13){
            $scope.go_click($scope.enteredId);
        }
    };

}]);
