angular.module('app.atc').controller('app.atc.detailcontroller', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.atc.configservice', 'app.atc.dataservice',
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, appAtcConfig, appAtcData) {

    $scope.$parent.titleExtension = " - ATC Details";
    $scope.filterText = '';


    $scope.atcData = {};
    $scope.atcData.detailsData = [];

    $scope.atcData = appAtcData.getInstanceForAppId($routeParams.appId);
    $scope.atcData.tableData = [];

    $scope.statusMap = {};

    if (appAtcConfig.isInitialized === false) {
        appAtcConfig.initialize($routeParams.appId);
    }
    $scope.atcData.getDetailsForConfig(appAtcConfig.getConfigForAppId($routeParams.appId), $scope);
    $scope.atcData.loadOverviewData(); // also reload overview data in case we are navigating to the details page first and then navigate back to the overview page

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
        }
    }, true);

    $scope.$watch('statusMap', function()
    {
        $scope.atcData.tableData = [];
        if($scope.atcData && $scope.atcData.detailsData)
        {
            $scope.atcData.detailsData.forEach(function (atcEntry) {
                if ($scope.statusMap[atcEntry.CHECK_MSG_PRIO].active) {
                    $scope.atcData.tableData.push(atcEntry);
                }
            });
        }
    }, true);

    $scope.getStatusArray = function () {
        return Object.keys($scope.statusMap);
    };

}]);
