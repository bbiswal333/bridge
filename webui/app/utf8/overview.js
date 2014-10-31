'use strict';

angular.module('app.utf8', []);

angular.module('app.utf8').directive('app.utf8',[function () {

	var directiveController = ['$scope', '$window', '$http', function ($scope, $window, $http) {
		$scope.utf8 = function(string) {
			var char;
			var charArr = string.split('');
			$scope.result = '';

			charArr.forEach(function(char) {
				$scope.result += "&" + char.charCodeAt(0) + ";";
			});
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/utf8/overview.html',
		controller: directiveController
	};
}]);
