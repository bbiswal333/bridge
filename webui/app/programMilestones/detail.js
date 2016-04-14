angular.module('app.programMilestones').controller('app.programMilestones.detailController',
    ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.programMilestones.configFactory', 'app.programMilestones.dataFactory',
	function ($scope, $http, $filter, $route, $routeParams, ngTableParams, configFactory, dataFactory) {

	var programMilestonesConfig = configFactory.getConfigForAppId("app.programMilestones-" + $routeParams.instanceNumber);

    $scope.$parent.titleExtension = " - Program Milestones Details";
    $scope.filterText = '';
    $scope.filterTable = function(){
        return $scope.data.tableData;
    } 

    $scope.data = dataFactory.getDataForAppId("app.programMilestones-" + $routeParams.instanceNumber);
    $scope.data.tableData = [];
    $scope.data.type = {};
    $scope.data.type.dc = true;
    $scope.data.type.rtc = true;
    $scope.data.type.ecc = true;
    $scope.data.type.cc = true;

    $scope.statusMap = {};

    if (programMilestonesConfig.isInitialized === false) {
        programMilestonesConfig.initialize("app.programMilestones-" + $routeParams.instanceNumber);
    }

    $scope.config = programMilestonesConfig;
    $scope.programs = $scope.config.getPrograms();
    $scope.milestoneTypes = $scope.config.getMilestoneTypes();

    $scope.config.isInitialized().then(function() {
        $scope.data.refreshMilestones().then(function() {
            $scope.data.detailsData = $scope.data.getMilestones();
        });
    });

    $scope.columnVisibility = true;

   // $scope.data.tableData = $scope.data.refreshMilestones(); // also reload overview data in case we are navigating to the details page first and then navigate back to the overview page

    function updateTableData () {
        $scope.data.tableData = [];
        if($scope.data && $scope.data.detailsData)
        {
            $scope.data.detailsData.forEach(function(entry){
                if ($scope.statusMap[entry.getMilestoneTypeAsStr().toLowerCase()].active) {
                    $scope.data.tableData.push(entry);
                }
            });
        }
    };

    $scope.$watch('data.detailsData', function ()
    {
        if($scope.data.detailsData && $scope.data.detailsData.length > 0)
        {
            $scope.statusMap = {};
            for (var t in $scope.data.type) {
                if ($scope.data.type.hasOwnProperty(t)) {
                    $scope.statusMap[t] = { "active": true };
                } else {
                    $scope.statusMap[t] = { "active": false };
                }
            }
            $scope.data.type = $scope.statusMap;
            updateTableData();
        }
    }, true);

    $scope.$watch('statusMap', function() {
        updateTableData();
    }, true);

    $scope.getStatusArray = function () {
        return Object.keys($scope.data.type);
    };
}]);