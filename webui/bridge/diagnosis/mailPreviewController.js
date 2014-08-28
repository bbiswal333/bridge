angular.module('bridge.diagnosis').mailPreviewController = ["$scope", "$modalInstance", "frameContent", function ($scope, $modalInstance, frameContent) {
    $scope.frameContent = frameContent;

    $scope.send_click = function () {
        $modalInstance.close();
    };
    $scope.cancel_click = function () {
        $modalInstance.dismiss();
    };
}];

angular.module('bridge.diagnosis').directive('frame', function () {
    return function ($scope) {
        angular.element("#previewIFrame")[0].contentWindow.document.write($scope.frameContent);
    };
});
