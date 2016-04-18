angular.module('app.programMilestones').controller('app.programMilestones.detailController',
    ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.programMilestones.configFactory', 'app.programMilestones.dataFactory',
	function ($scope, $http, $filter, $route, $routeParams, ngTableParams, configFactory, dataFactory) {

	var programMilestonesConfig = configFactory.getConfigForAppId("app.programMilestones-" + $routeParams.instanceNumber);

    $scope.$parent.titleExtension = " - Program Milestones Details";
    $scope.filterText = '';
    $scope.filterTable = function(){
        return $scope.data.tableData;
    };

    $scope.data = dataFactory.getDataForAppId("app.programMilestones-" + $routeParams.instanceNumber);
    $scope.data.tableData = [];
    $scope.availableMilestoneTypes = ['ALL', 'RTC', 'DC', 'ECC', 'CC'];

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

    if(!$scope.data.tableData) {
        $scope.data.tableData = $scope.data.refreshMilestones(); // also reload overview data in case we are navigating to the details page first and then navigate back to the overview page
    }

    function updateTableData () {
        $scope.data.tableData = [];
        if($scope.data && $scope.data.detailsData)
        {
            $scope.data.detailsData.forEach(function(entry){
                 if ( $scope.config.isMilestoneTypeActive(entry.getMilestoneTypeAsStr())) {
                    $scope.data.tableData.push(entry);
                }
            });
        }
    }

    $scope.$watch('data.detailsData', function ()
    {
        if($scope.data.detailsData && $scope.data.detailsData.length > 0)
        {
            updateTableData();
        }
    }, true);

    $scope.$watch('milestoneTypes', function() {
        updateTableData();
    }, true);
}]);
