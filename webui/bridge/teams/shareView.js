/*global Clipboard*/
angular.module("bridge.teams").controller("bridge.viewBar.shareViewController", ["$scope", "$http", "bridge.service.guid", "bridgeInstance", "$window",
    function($scope, $http, guidService, bridgeInstance, $window) {
        $scope.viewUrl = $window.location.origin + "/#/view/" + $scope.selectedProject.view;
        new Clipboard('.clipBoardButton'); // eslint-disable-line no-new

        $scope.recipients = [];

        $scope.onSelectRecipient = function(recipient) {
            $scope.recipients.push(recipient);
        };

        $scope.removeRecipient = function(recipient) {
            $scope.recipients.splice($scope.recipients.indexOf(recipient), 1);
        };

        $scope.shareViaMail = function() {
            $window.open("mailto:" + $scope.recipients.map(function(recipient) { return recipient.BNAME; }).join(";") + "?body=" + escape($scope.viewUrl));
        };
}]);
