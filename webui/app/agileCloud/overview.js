angular.module('app.agilecloud', []);
angular.module('app.agilecloud').directive('app.agilecloud', function () {

    var directiveController = ['$scope', '$window', 'app.agileCloud.dataService', function ($scope, $window, dataService)
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
					$scope.author = 'Voice of ASE@SAP';
				}
			});
		};
		$scope.updateQuote();
		$scope.box.reloadApp($scope.updateQuote, 60 * 60);	// 1 hour

		// Open google search window
		$scope.googleQuote = function() {
			$window.open('https://google.com/#q=' + $scope.quote);
		};
		$scope.googleAuthor = function() {
			if ($scope.author === 'Voice of ASE@SAP') {
				$window.open('https://go.sap.corp/ase');
			} else {
				$window.open('https://google.com/#q=' + $scope.author);
			}
		};
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/agileCloud/overview.html',
        controller: directiveController
    };
});
