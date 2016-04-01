angular.module('bridge.app').directive('bridge.employee', [function() {
    return {
        restrict: 'E',
        scope: {
        	id: '=',
            mailBody: '@',
            mailSubject: '@',
            attachTo: '=',
            firstName: '=',
            lastName: '=',
            email: '=',
            phone: '='
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

            function refreshEmployeeDataFromScope() {
                $scope.employee = {
                    VORNA: $scope.firstName,
                    NACHN: $scope.lastName,
                    fullName: $scope.firstName + " " + $scope.lastName,
                    BNAME: $scope.id,
                    ID: $scope.id,
                    SMTP_MAIL: $scope.email,
                    TELNR: $scope.phone
                };
            }

            if(!$scope.firstName) {
                loadEmployeeData();
            } else {
                refreshEmployeeDataFromScope();
            }

            $scope.$watch("id", function(newValue, oldValue) {
                if(newValue !== oldValue && !$scope.firstName) {
                    loadEmployeeData();
                } else {
                    refreshEmployeeDataFromScope();
                }
            });
        }],
        templateUrl: 'bridge/controls/employee.html'
    };
}]);
