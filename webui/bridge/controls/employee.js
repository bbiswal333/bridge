angular.module('bridge.app').directive('bridge.employee', [function() {

    return {
        restrict: 'E',
        scope: {
        	id: '=',
            mailBody: '@',
            mailSubject: '@',
            attachTo: '='
        },
        controller: ['$scope', 'employeeService', function($scope, employeeService) {
            function loadEmployeeData() {
                employeeService.getData($scope.id).then(function(data) {
                    if(data.BNAME === "") {
                        data.BNAME = $scope.id;
                        data.NACHN = $scope.id;
                        data.VORNA = $scope.id;
                        data.fullName = $scope.id;
                    }

                    $scope.employee = data;
                    if($scope.attachTo) {
                        $scope.attachTo.employee = $scope.employee;
                    }
                });
            }

            loadEmployeeData();

            $scope.$watch("id", function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    loadEmployeeData();
                }
            });
        }],
        templateUrl: 'bridge/controls/employee.html'
    };
}]);
