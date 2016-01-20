angular.module('bridge.controls').directive('bridge.akhResponsibleSelector', ["bridge.AKHResponsibleFactory", function(AKHResponsibleFactory) {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/akhResponsible/AKHResponsibleSelector.html',
        replace: true,
        scope: {
        	responsibles: '='
        },
        controller: function($scope) {
        	$scope.Roles = [
        		{Name: "Development Component Owner", Key: "DEV_UID_DM"},
        		{Name: "Delivery Manager", Key: "DEV_UID_DLVRY_M"},
        		{Name: "Development Product Owner", Key: "DEV_UID_PRDOWNER"}
        	];

        	$scope.selectedRole = $scope.Roles[0];

		    $scope.setSelectedRole = function(role) {
		    	$scope.selectedRole = role;
		    };

		    $scope.responsibleAdded = function(employee) {
		    	if($scope.responsibles && $scope.responsibles.push) {
		    		$scope.responsibles.push(AKHResponsibleFactory.createInstance($scope.selectedRole.Key, employee.BNAME));
		    	}
		    };
        }
    };
}]);
