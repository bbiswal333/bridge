angular.module('app.sapNews', []);
angular.module('app.sapNews').directive('app.sapNews', function () {

    var directiveController = ['$scope', 'app.sapNews.feedService', function ($scope, feedService)
    {
        $scope.feeds = [];

        function getFeedCallback(data){
            $scope.feeds = data.channel.item;
            $scope.feed = {};
            $scope.feed.title = $scope.feeds[0].title;
            $scope.feed.link = $scope.feeds[0].link;
            $scope.feed.text = $scope.feeds[0].description;

            console.log($scope.feeds);
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
