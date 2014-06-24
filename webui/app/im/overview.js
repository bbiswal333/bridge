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

        if($scope.selection === undefined)
        {
            $scope.selection = {};
        }
        $scope.prios = ticketData.prios;        
        $scope.$parent.titleExtension = " - Internal Messages";
        $scope.dataInitialized = ticketData.isInitialized;
        $scope.showNoMessages = false;

        $scope.$watch("prios", function () {
            setNoMessagesFlag();
        }, true);


        $scope.$watch('selection', function() {      
            angular.forEach($scope.prios, function(prio){
                prio.selected = 0;
                if($scope.selection.sel_components) { prio.selected = prio.selected + prio.sel_components; }
                if($scope.selection.colleagues)     { prio.selected = prio.selected + prio.colleagues; }
                if($scope.selection.assigned_me)    { prio.selected = prio.selected + prio.assigned_me; }
                if($scope.selection.created_me)     { prio.selected = prio.selected + prio.created_me; }
                
            });                  
        },true);  

        function setNoMessagesFlag() {
            if (ticketData.isInitialized.value == true && ($scope.prios[0].total + $scope.prios[1].total + $scope.prios[2].total + $scope.prios[3].total) == 0) {
                $scope.showNoMessages = true;
            } else {
                $scope.showNoMessages = false;
            }
        };

        if (ticketData.isInitialized.value === false) {
            var initPromise = ticketData.initialize();
            initPromise.then(function success(data) {
                setNoMessagesFlag();
                $scope.selection.sel_components = true;
                $scope.selection.colleagues = false;
                $scope.selection.assigned_me = false;
                $scope.selection.created_me = false;
            });
        }

}]);
    
