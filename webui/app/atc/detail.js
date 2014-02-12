angular.module('app.atc').controller('app.atc.detailcontroller', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.atc.configservice', 'app.atc.dataservice', 
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, appAtcConfig, appAtcData) {
    
    var atcConfig = appAtcConfig;
    $scope.$parent.titleExtension = " - ATC Details";

    $scope.atcData = appAtcData;    
    $scope.atcData.getDetailsForConfig(atcConfig, $scope);

    $scope.$watch('atcData.detailsData', function () {
        if ($scope.atcData !== undefined && $scope.atcData.detailsData.length > 0 && $scope.tableParams.settings().$scope != null) {
            $scope.tableParams.total($scope.atcData.detailsData.length);
            $scope.tableParams.reload();
        }
    });

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            CHECK_MSG_PRIO: 'asc'     // initial sorting
        },
    }, {
        total: $scope.atcDetails == undefined ? 0 : $scope.atcDetails.length, // length of data
        getData: function ($defer, params) {
            var orderedData = params.sorting() ?
                                $filter('orderBy')($scope.atcData.detailsData, params.orderBy()) :
                                $scope.atcData.detailsData;

            if (orderedData != undefined) {
                orderedData = params.filter() ?
                                $filter('filter')(orderedData, params.filter()) :
                                orderedData;

                params.total(orderedData.length);

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }
    });
}]);