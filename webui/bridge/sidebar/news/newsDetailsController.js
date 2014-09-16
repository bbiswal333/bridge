angular.module('bridge.app').controller('newsDetailController', [ '$scope', 'bridge.service.bridgeNews', function ($scope, newsService) {
    $scope.selectedNews = newsService.selectedNews;
}]);