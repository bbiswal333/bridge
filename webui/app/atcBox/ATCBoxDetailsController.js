atcApp.controller('atcDetailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'Config', 'ATCDataProvider',
                        function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams, Config, ATCDataProvider) {
    $scope.$parent.titleExtension = " - ATC Details";

    ATCDataProvider.getDetailsForConfig(Config, $scope);

    $scope.$watch('atcDetails', function () {
        if ($scope.atcDetails !== undefined) {
            $scope.tableParams.total($scope.atcDetails.length);
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
                                $filter('orderBy')($scope.atcDetails, params.orderBy()) :
                                kpis;

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