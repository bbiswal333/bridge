angular.module('app.atc').controller('app.atc.detailcontroller', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.atc.configservice', 'app.atc.dataservice', 
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, appAtcConfig, appAtcData) {
    
    $scope.$parent.titleExtension = " - ATC Details";
    $scope.filterText = '';


    $scope.atcData = {};
    $scope.atcData.detailsData = [];    

    $scope.atcData = appAtcData;          
    $scope.atcData.tableData = [];
    
    $scope.statusArray = [];     

    var infinityLimitStep = 100;
    $scope.infinityLimit = infinityLimitStep;
    $scope.reverse = true;
    $scope.predicate = null;


    if (appAtcConfig.isInitialized == false) {
        appAtcConfig.initialize($routeParams['appId']);
    }
    $scope.atcData.getDetailsForConfig(appAtcConfig, $scope);
    $scope.atcData.loadOverviewData(); // also reload overview data in case we are navigating to the details page first and then navigate back to the overview page

    $scope.$watch('atcData.detailsData', function () 
    {            
        if($scope.atcData.detailsData.length > 0)
        {
            var status_filter = $routeParams['prio'].split('|'); 
            var status = [];
            $scope.statusArray = [];  
            for(var i = 1; i <= 4; i++)
            {
                if(status_filter.indexOf(i + "") > -1)
                    status.push({"name":i,"active":true});   
                else
                    status.push({"name":i,"active":false});   
            }
            $scope.statusArray = status;         
        }
        
    }, true);

    $scope.$watch('statusArray', function()
    {
        $scope.atcData.tableData = [];
        if($scope.atcData && $scope.atcData.detailsData)
        {
            for(var i = 0; i < $scope.atcData.detailsData.length; i++ )
            {
                for(var j = 0; j < $scope.statusArray.length; j++)
                {
                    if($scope.atcData.detailsData[i].CHECK_MSG_PRIO == $scope.statusArray[j].name && $scope.statusArray[j].active)
                    {
                        $scope.atcData.tableData.push($scope.atcData.detailsData[i]);
                    }
                }
            }
        }
    }, true);

    $scope.zebraCell = function(index){
        return 'row' + index%2;
    }

    $scope.increaseInfinityLimit = function(){
        $scope.infinityLimit += infinityLimitStep;
    }

    $scope.sort = function(selector){
        $scope.predicate = selector;
        $scope.reverse = !$scope.reverse;
    }

}]);

angular.module('app.atc').directive("infinitescroll", ['$window', function($window){
    return function(scope, elm, attr) {
        var container = angular.element( document.querySelector( '#scrollContainer' ));
        var cont = container[0];

        container.bind("scroll", function() {
            var containerBottom = cont.scrollTop + cont.offsetHeight;
            var elementBottom = elm[0].scrollHeight + elm[0].offsetTop;

            if (containerBottom >= elementBottom) {
                scope.$apply(scope.increaseInfinityLimit());
            } else if (cont.scrollTop === 0){
                //should we reset limit to the initial size?
            }
        });    
    }
}])