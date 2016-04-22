angular.module('app.programMilestones').controller('app.programMilestones.detailController',
    ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.programMilestones.configFactory', 'app.programMilestones.dataFactory',
	function ($scope, $http, $filter, $route, $routeParams, ngTableParams, configFactory, dataFactory) {

	var programMilestonesConfig = configFactory.getConfigForAppId("app.programMilestones-" + $routeParams.instanceNumber);

    $scope.$parent.titleExtension = " - Program Milestones Details";
    $scope.filterText = '';

    var dataService = dataFactory.getDataForAppId("app.programMilestones-" + $routeParams.instanceNumber);
    $scope.tableData = [];

    if (programMilestonesConfig.isInitialized === false) {
        programMilestonesConfig.initialize("app.programMilestones-" + $routeParams.instanceNumber);
    }

    $scope.config = programMilestonesConfig;
    $scope.programs = $scope.config.getPrograms();
    $scope.milestoneTypes = $scope.config.getMilestoneTypes();
    $scope.availableMilestoneTypes = [{label: 'ALL', value:['ALL']},
                                        {label:'DC', value:['0108']},
                                        {label:'CC', value:['0210','0932']},
                                        {label:'ECC', value:['0702','0922']},
                                        {label:'RTC', value:['0714','0928']}
                                    ];
    $scope.config.isInitialized().then(function() {
        dataService.refreshMilestones().then(function() {
            $scope.tableData = dataService.getMilestones();
        });
    });

    $scope.columnVisibility = true;

    function updateTableData () {
        dataService.refreshMilestones();
    }

    $scope.$watch('milestoneTypes', function() {
        updateTableData();
    }, true);
}]);
