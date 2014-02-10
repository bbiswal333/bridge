angular.module("app.atc.settings", ["app.atc.config"]).factory("appAtcSettings", function ($scope, $filter, ngTableParams, appAtcConfig) {
    $scope.config = appAtcConfig;

    $scope.currentConfigValues = new ConfigItem();

    $scope.$watch('config', function () {
        if ($scope.tableParams.settings().$scope != null)
            $scope.tableParams.reload();
    }, true);

    $scope.add_click = function () {
        var copiedConfigItem = angular.copy($scope.currentConfigValues);
        
        $scope.config.addConfigItem(copiedConfigItem);
    };

    $scope.remove_click = function (configItem) {
        var index = $scope.config.configItems.indexOf(configItem);
        if (index > -1) {
            $scope.config.configItems.splice(index, 1);
        }
    };

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
});