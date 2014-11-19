angular.module('app.atc').appAtcSettings = ['$filter', 'ngTableParams', 'app.atc.configservice', '$scope', '$window', function ($filter, ngTableParams, appAtcConfig, $scope, $window) {
    $scope.config = appAtcConfig;
    $scope.currentConfigValues = appAtcConfig.newItem();
    $scope.currentConfigValues.onlyInProcess = true;

    $scope.closeForm = function () {
        $scope.$emit('closeSettingsScreen');
    };

    $scope.$watch('config', function () {
        if ($scope.tableParams.settings().$scope != null) {
            $scope.tableParams.reload();
        }
    }, true);

    $scope.add_click = function () {
        if (!$scope.currentConfigValues.isEmpty()) {
            var copiedConfigItem = angular.copy($scope.currentConfigValues);
            $scope.currentConfigValues.clear();
            $scope.config.addConfigItem(copiedConfigItem);
        }
    };

    $scope.remove_click = function (configItem) {
        var index = $scope.config.configItems.indexOf(configItem);
        if (index > -1) {
            $scope.config.configItems.splice(index, 1);
        }
    };
    
    $scope.rss_for_selection_click = function () {
        if (!$scope.currentConfigValues.isEmpty()) {         
            $window.open('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + $scope.currentConfigValues.getQueryString() + '&format=rss');
        }
    };
    
    $scope.rss_for_saved_selection_click = function () {
        $window.open('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + $scope.config.getQueryString() + '&format=rss');
    };

/*eslint-disable */
    $scope.tableParams = new ngTableParams({
/*eslint-enable */
        page: 1,            // show first page
        count: 100           // count per page
    }, {
        counts: [], // hide page counts control
        total: $scope.config.configItems.length,
        getData: function ($defer, params) {
            var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.config.configItems, params.orderBy()) :
                    $scope.config.configItems;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
}];
