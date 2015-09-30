angular.module('app.quickaccess', []);
angular.module('app.quickaccess').directive('app.quickaccess',[ "$window", function ($window) {

	var directiveController = ['$scope', function ($scope) {
		$scope.notetxt = "SAP Notes";
		$scope.inctxt = "Incidents";
		$scope.openNote = function() {
			$window.open("https://css.wdf.sap.corp/sap/support/notes/" + $scope.notenr, '_blank');
		};
		$scope.openIntInc = function() {
			$scope.incnr.replace('/[^0-9]/', "");
			$window.open("http://ims2crm1.wdf.sap.corp:1080/ngcss/index.php?ref=2&incident=" + $scope.incnr, '_blank');
		};
		$scope.noteFocus = function() {
			$scope.notenr = "";
		};
		$scope.incFocus = function() {
			$scope.incnr = "";
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/quickaccess/overview.html',
		controller: directiveController
	};
}]);
