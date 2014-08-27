angular.module('app.employeeSearch', ['bridge.employeeSearch']);

angular.module('app.employeeSearch').directive('app.employeeSearch', function ($modal, $http, $window) {

    var directiveController = ['$scope', function ($scope) {
        $scope.box.boxSize = "2"; 

	    $scope.copyClipboard = function(text)
		{
			$http.get($window.client.origin + '/api/client/copy?text=' + encodeURIComponent(text));
		};

		$scope.$watch('selectedEmployee', function () {
            if($scope.selectedEmployee === "tetris")
            {
            	$window.location.href = '#/tetris';
            }
        }, true);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
});
