angular.module('bridge.app').controller('newsDetailController', [ '$scope', 'bridge.service.bridgeNews', function ($scope, newsService) {
    $scope.news = newsService.news.data;

    $scope.closeModal = function(){
        newsService.modalInstance.close();
    };
}]);
