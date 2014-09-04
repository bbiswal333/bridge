angular.module('app.sapNews', []);
angular.module('app.sapNews').directive('app.sapNews', function () {

    var directiveController = ['$scope', 'app.sapNews.feedService', function ($scope, feedService)
    {
        $scope.feeds = [];

        function getFeedCallback(data){
            $scope.feeds = data.channel.item;
        }

        //do only once:
        if ($scope.feeds.length === 0) {
            feedService.getNews().then(getFeedCallback);
        }
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/sapNews/overview.html',
        controller: directiveController
    };
});
