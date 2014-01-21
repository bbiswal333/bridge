atcApp.settingsController = function ($scope, $filter, ngTableParams, Config) {
    $scope.config = Config;

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.config.configItems.length,
        getData: function($defer, params) {
            var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.config.configItems, params.orderBy()) :
                    $scope.config.configItems;
    
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
};