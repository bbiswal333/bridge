angular.module('app.chuck', []);
angular.module('app.chuck').directive('app.chuck', ['$http', function ($http)
{
    var directiveController = ['$scope', function ($scope)
    {

    	$scope.updateQuote = function()
    	{
    		var joke = $scope.data[Math.floor(Math.random() * $scope.data.length)].joke;
            joke = $('<div/>').html(joke).text();

            if(joke.length > 160)
    		{
    			$scope.quote = joke.substring(0,158) + '...';
    		}
    		else
    		{
    			$scope.quote = joke;
    		}
    		$scope.longquote = joke;
    	};

    	$http.get('app/chuck/quotes.json').then(function(response)
    	{
        	$scope.data = response.data.value;
        	$scope.updateQuote();
            $scope.box.reloadApp($scope.updateQuote, 60 * 10);
        });

     }];

    return {
        restrict: 'E',
        templateUrl: 'app/chuck/overview.html',
        controller: directiveController
    };
}]);
