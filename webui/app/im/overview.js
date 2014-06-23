angular.module('app.im', ['ngTable']);

angular.module('app.im').directive('app.im', function () {

    var directiveController = ['$scope', function ($scope) {  
        $scope.box.boxSize = "1";      
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/im/overview.html',
        controller: directiveController
    };
});

 angular.module('app.im').controller('app.im.directiveController', ['$scope', '$http', 'app.im.ticketData',
    function Controller($scope, $http, ticketData) {

        $scope.prios = [{
            name: "Very high", number: 1, amount: 0
        }, {
            name: "High", number: 2, amount: 0
        }, {
            name: "Medium", number: 3, amount: 0
        }, {
            name: "Low", number: 4, amount: 0
        }];

        $scope.selection = {};
        $scope.selection.sel_components = true;
        $scope.selection.colleagues = false;
        $scope.selection.assigned_me = false;
        $scope.selection.created_me = false;


        function parseBackendTicket(backendTicket) {

            angular.forEach($scope.prios, function(prios) 
            {
                if (backendTicket.PRIO === prios.number.toString())
                {
                    prios.amount++;
                }
            });

        }

        $scope.$parent.titleExtension = " - Internal Messages"; 
        $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?sap-language=en&origin=' + location.origin
            ).success(function(data) {
                data = new X2JS().xml_str2json(data);
                var imData = data.abap;
                ticketData.backendTickets = imData.values;

                // if you have multiple tickets, DEVDB_MESSAGE_OUT is an array, otherwise a simple object
                if (angular.isArray(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) 
                {
                    angular.forEach(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (backendTicket) 
                    {
                        parseBackendTicket(backendTicket);
                    });
                } else if (angular.isObject(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT)) {
                    parseBackendTicket(ticketData.backendTickets.INTCOMP_LONG.DEVDB_MESSAGE_OUT);
                }

                if (($scope.prios[0].amount + $scope.prios[1].amount + $scope.prios[2].amount + $scope.prios[3].amount) === 0) {
                    $scope.lastElement = "You have no internal messages to display!";
                    $scope.displayChart = false;
                }                
                else 
                {
                    $scope.displayChart = true;
                }

            }).error(function() {
                $scope.imData = [];                
            });




 }]);
    
