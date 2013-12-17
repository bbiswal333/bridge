bridgeApp.controller('atcDetailController', ['$scope', '$http', '$route', '$routeParams', 'ngTableParams', function Controller($scope, $http, $route, $routeParams, ngTableParams) {
    $scope.$parent.titleExtension = " - ATC Details";

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        },
    }, {
        groupBy: 'kpi',
        total: kpis.length, // length of data
        getData: function ($defer, params) {
            var orderedData = params.sorting() ?
                                $filter('orderBy')(kpis, params.orderBy()) :
                                kpis;

            orderedData = params.filter() ?
                            $filter('filter')(orderedData, $scope.filterString) :
                            orderedData;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
}]);