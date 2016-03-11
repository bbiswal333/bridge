angular.module('bridge.controls').directive('bridge.akhResponsibleTag', [function() {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/akhResponsible/AKHResponsibleTag.html',
        scope: {
        	responsible: '=',
        	responsibles: '='
        },
        controller: function($scope) {
        	$scope.removeClick = function() {
        		$scope.responsibles.splice($scope.responsibles.indexOf($scope.responsible), 1);
        	};
        }
    };
}]);
