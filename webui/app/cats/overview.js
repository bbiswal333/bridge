angular.module('app.cats', ["lib.utils", "app.cats.data", "ngRoute"]);

angular.module("app.cats").directive("app.cats",
	function () {
	    var controller = ['$scope', function ($scope) {
	        $scope.boxTitle = "CATS Compliance";
	        $scope.boxIcon = '&#xe81c;';
	        $scope.boxIconClass = 'icon-clock';
	        $scope.boxNeedsClient = false;
	        $scope.boxSize = "2";
	    }];

	    return {
	        restrict: "E",
            controller: controller,
		    templateUrl: "app/cats/overview.html",
	    };
});