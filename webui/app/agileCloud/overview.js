angular.module('app.agilecloud', []);
angular.module('app.agilecloud').directive('app.agilecloud', function () {

    var directiveController = ['$scope', '$q', 'app.agileCloud.dataService', function ($scope, $q, dataService)
    {   // Update quotes randomly
		$scope.updateQuote = function() {

			dataService.getData().then(function(data) {
				$scope.messages = data.Messages;
				var ind = Math.floor(Math.random() * $scope.messages.length);
				var quoteauthor = $scope.messages[ind].split('//');

				if(quoteauthor.length > 1) {
					$scope.quote  = quoteauthor[0];
					$scope.author = quoteauthor[1];
				} else {
					$scope.quote  = quoteauthor[0];
					$scope.author = '';
				}		
			});

		};
		$scope.updateQuote();
		$scope.box.reloadApp($scope.updateQuote, 60 * 60);	// 1 hour
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/AgileCloud/overview.html',
        controller: directiveController
    };
});
