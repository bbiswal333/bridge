angular.module("bridge.teams").controller("bridge.viewBar.shareViewController", ["$scope", "$http", "bridge.service.guid", "bridgeInstance", "$window", "$log", "bridgeDataService", "bridgeConfig", "$modalInstance",
    function($scope, $http, guidService, bridgeInstance, $window, $log, bridgeDataService, bridgeConfig, $modalInstance) {
        $scope.viewUrl = $window.location.origin + "#/view/" + $scope.selectedProject.view;
        new Clipboard('.clipBoardButton');

        $scope.recipients = [];

        $scope.onSelectRecipient = function(recipient) {
            $scope.recipients.push(recipient);
        };

        $scope.removeRecipient = function(recipient) {
            $scope.recipients.splice($scope.recipients.indexOf(recipient), 1);
        };

        $scope.shareViaMail = function() {
            $window.open("mailto:" + $scope.recipients.map(function(recipient) { return recipient.BNAME; }).join(";") + "?body=" + $scope.viewUrl);
        };
}]);
