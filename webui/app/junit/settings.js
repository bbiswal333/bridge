angular.module('app.junit').appJUnitSettings = ['$filter', 'ngTableParams', 'app.junit.configService', '$scope', function ($filter, ngTableParams, appJUnitConfig, $scope) {
  $scope.config = appJUnitConfig.getConfigForAppId($scope.boxScope.metadata.guid);
  $scope.currentConfigValues = appJUnitConfig.getConfigForAppId($scope.boxScope.metadata.guid).newItem();

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
