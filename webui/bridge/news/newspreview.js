
angular.module('bridge.app').directive('bridge.newspreview', ['$http', function ($http) {

    var directiveController = ['$scope', function ($scope)
    {
      $http.get('../bridge/news/news.json').then(function(response)
      {
        $scope.data = response.data.news;
      });
    }];

    return {
      controller: directiveController,
      restrict: 'E',
      template: '<div class="hover" style="height: 70px; width: 110%; position: relative; left: -15px;">' +
                  '<div class="boxLeft">' +
                    '<span class="image_rounded_shadow">' +
                      '<img style="margin-top:10px;margin-left:15px;pointer-events:auto;border-radius:100%;border:4px solid #4EA175" src="{{data[newsId].snapURL}}" width="50px" height="50px" />' +
                    '</span>' +
                  '</div>' +
                  '<div class="boxRight" style="padding-top:5px;padding-left:10px">' +
                    '<b style="text-transform:uppercase;">' + '{{data[newsId].header}}' + '</b>' +
                    '<br/>' +
                    '{{data[newsId].preview}}' +
                  '</div> ' +
                '</div> ',
      scope: {
            newsId: '@'
      }
    };
}]);
