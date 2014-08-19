angular.module('app.chuck', []);
angular.module('app.chuck').directive('app.chuck', ['$http', '$interval', function ($http, $interval) 
{

    var directiveController = ['$scope', function ($scope) 
    {	

    	$scope.updateQuote = function()
    	{
    		var joke = $scope.data[Math.floor(Math.random() * $scope.data.length)].joke;
    		joke = joke.replace(/&quot;/ig,'"');
    		if(joke.length > 110)
    		{
    			$scope.quote = joke.substring(0,108) + '..';
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
        	$interval($scope.updateQuote(), 60000 * 60);        	        
        });

     }];

    return {
        restrict: 'E',
        templateUrl: 'app/chuck/overview.html',
        controller: directiveController
    };
}]);