angular.module('app.sapNews', []);
angular.module('app.sapNews').directive('app.sapNews', function () {

    var directiveController = ['$scope', 'app.sapNews.feedService', function ($scope, feedService)
    {
        $scope.box.boxSize = '2';
        $scope.feeds = [];

        function getFeedCallback(data){
            $scope.feeds = data.channel.item;
            $scope.switch_feed(0);
        }

        $scope.switch_feed = function(number){
            $scope.feedNumber = number;
            $scope.feed = {};
            $scope.feed.title = $scope.feeds[number].title;   
            $scope.feed.link = $scope.feeds[number].link;
            $scope.feed.text = $scope.feeds[number].description.toString();
            $scope.feed.content = $scope.feeds[number].encoded.toString();
        };

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
