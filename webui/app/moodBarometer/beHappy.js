angular.module('app.moodBarometer').controller("app.MoodBarometer.ModalCtrl", function ($scope, $modalInstance) {
    $scope.cat = 'http://thecatapi.com//api/images/get';
    $scope.save_click = function () {
        $modalInstance.close();
    };
});
