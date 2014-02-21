angular.module("app.cats.allocationbar", []).directive("app.cats.allocationbar", function () {
	var linkFn = function ($scope) {
		$scope.fireValChanged = function (val) {
			$scope.onValChanged({val: val});
		}
	};

	return {
		restrict: "E",
		scope: {
			onValChanged: "&onvalchanged"
		},
		link: linkFn,
		templateUrl: "allocationBarDirective.tmpl.html"
	};
}).controller("myController", function ($scope) {
	$scope.value = "Hallo";

	$scope.myCallback = function (val) {
		$scope.value = val;
		console.log(val);
	};
});