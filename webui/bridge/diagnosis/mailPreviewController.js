angular.module('bridge.diagnosis').mailPreviewController = function ($scope, $modalInstance, frameContent) {
    //$scope.frameContent = "<html><body><h1>test</h1></body></html>";
    $scope.frameContent = frameContent;

    $scope.send_click = function () {
        $modalInstance.close();
    };
    $scope.cancel_click = function () {
        $modalInstance.dismiss();
    };
};

angular.module('bridge.diagnosis').directive('frame', function ($compile) {
    return function ($scope, $element) {
        angular.element("#previewIFrame")[0].contentWindow.document.write($scope.frameContent);
    };
});