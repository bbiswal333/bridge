angular.module('app.atc').controller('app.atc.detailcontroller', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.atc.configservice', 'app.atc.dataservice',
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, appAtcConfig, appAtcData) {

    var atcConfig = appAtcConfig.getConfigForAppId("app.atc-" + $routeParams.instanceNumber);

    $scope.$parent.titleExtension = " - ATC Details";
    $scope.filterText = '';

    $scope.atcData = appAtcData.getInstanceForAppId("app.atc-" + $routeParams.instanceNumber);
    $scope.atcData.tableData = [];

    $scope.statusMap = {};

    if (atcConfig.isInitialized === false) {
        atcConfig.initialize("app.atc-" + $routeParams.instanceNumber);
    }

    $scope.config = atcConfig;

    $scope.loadingPromise = $scope.atcData.getDetailsForConfig(atcConfig);

    $scope.atcData.loadOverviewData(); // also reload overview data in case we are navigating to the details page first and then navigate back to the overview page

    function updateTableData() {
        $scope.atcData.tableData = [];
        if($scope.atcData && $scope.atcData.detailsData)
        {
            $scope.atcData.detailsData.forEach(function (atcEntry) {
                if ($scope.statusMap[atcEntry.CHECK_MSG_PRIO].active) {
                    $scope.atcData.tableData.push(atcEntry);
                }
            });
        }
    }

    $scope.$watch('atcData.detailsData', function ()
    {
        if($scope.atcData.detailsData.length > 0)
        {
            var status_filter = $routeParams.prio.split('|');
            $scope.statusMap = {};
            for(var i = 1; i <= 4; i++)
            {
                if (status_filter.indexOf(i + "") > -1) {
                    $scope.statusMap[i] = { "active": true };
                } else {
                    $scope.statusMap[i] = { "active": false };
                }
            }
            updateTableData();
        }
    }, true);

    $scope.$watch('statusMap', function()
    {
        updateTableData();
    }, true);

    $scope.getStatusArray = function () {
        return Object.keys($scope.statusMap);
    };

}]);
