angular.module('bridge.app').controller('bridge.app.corsTestPageController', ["$scope", "$http", function ($scope, $http) {

    $scope.withCredentials = true;

    $scope.callService = function (url) {
        $scope.testResult = "loading...";

        $http({
            method: 'GET',
            url: url,
            withCredentials: $scope.withCredentials
        }).success(function (data) {
            $scope.testResult = "Success!";
        }).error(function (data) {
            $scope.testResult = "Failure! Check debug console for details.";
        });
    };
}]);

/*

        $http({
            method: 'GET',
            url: "https://pgxmain.wdf.sap.corp/sap/opu/odata/sap/ZMOB_INCIDENT;v=2/TicketCollection?$filter=PROCESS_TYPE eq 'ZINC,ZSER' and PARTIES_OF_REQ  eq 'D051804' and COMPLETED eq 'X'",
            withCredentials: true
        }).success(function (data) {
            alert(data);
        });

        */