/*globals jQuery*/
﻿angular.module('app.atc').appAtcSettings = ['$filter', 'ngTableParams', 'app.atc.configservice', '$scope', '$window', '$http', function ($filter, ngTableParams, appAtcConfig, $scope, $window, $http) {
    $scope.srcSystem = "";
    $scope.devClass = "";

    $scope.config = appAtcConfig.getConfigForAppId($scope.boxScope.metadata.guid);
    $scope.currentConfigValues = appAtcConfig.getConfigForAppId($scope.boxScope.metadata.guid).newItem();

    $scope.currentConfigValues.onlyInProcess = true;

    $scope.closeForm = function () {
        $scope.$emit('closeSettingsScreen');
    };

    $scope.onSelectSystem = function(value) {
        if($scope.currentConfigValues.srcSystems.indexOf(value) === -1) {
            $scope.currentConfigValues.srcSystems.push(value);
            $scope.currentConfigValues.srcSystem = "";
        }
    };

    $scope.removeSystem = function(value, configItem) {
        configItem.srcSystems.splice(configItem.srcSystems.indexOf(value), 1);
    };

    $scope.onSelectPackage = function(value) {
        if($scope.currentConfigValues.devClasses.indexOf(value) === -1) {
            $scope.currentConfigValues.devClasses.push(value);
            $scope.currentConfigValues.devClass = "";
        }
    };

    $scope.removePackage = function(value, configItem) {
        configItem.devClasses.splice(configItem.devClasses.indexOf(value), 1);
    };

    $scope.onSelectAKHComponent = function(value) {
        if($scope.currentConfigValues.components.indexOf(value) === -1) {
            $scope.currentConfigValues.components.push(value);
            $scope.currentConfigValues.component = "";
        }
    };

    $scope.removeAKHComponent = function(value, configItem) {
        configItem.components.splice(configItem.components.indexOf(value), 1);
    };

    $scope.onSelectSoftwareComponent = function(value) {
        if($scope.currentConfigValues.softwareComponents.indexOf(value) === -1) {
            $scope.currentConfigValues.softwareComponents.push(value);
            $scope.currentConfigValues.softwareComponent = "";
        }
    };

    $scope.removeSoftwareComponent = function(value, configItem) {
        configItem.softwareComponents.splice(configItem.softwareComponents.indexOf(value), 1);
    };

    $scope.onSelectResponsible = function(value) {
        for(var i = 0, length = $scope.currentConfigValues.tadirResponsibles.length; i < length; i++) {
            if($scope.currentConfigValues.tadirResponsibles[i].BNAME === value.BNAME) {
                return;
            }
        }
        $scope.currentConfigValues.tadirResponsibles.push(value);
        $scope.currentConfigValues.tadirResponsible = "";
    };

    $scope.removeResponsible = function(value, configItem) {
        configItem.tadirResponsibles.splice(configItem.tadirResponsibles.indexOf(value), 1);
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

    $scope.save_click = function() {
        $scope.currentConfigValues = appAtcConfig.getConfigForAppId($scope.boxScope.metadata.guid).newItem();
    };

    $scope.rss_click = function (configItem) {
        $window.open('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + configItem.getQueryString() + '&format=rss');
    };

    $scope.copy_click = function (configItem) {
        jQuery.extend($scope.currentConfigValues,configItem);
    };

    $scope.edit_click = function(configItem) {
        $scope.currentConfigValues = configItem;
    };

    $scope.remove_click = function (configItem) {
        var index = $scope.config.configItems.indexOf(configItem);
        if (index > -1) {
            $scope.config.configItems.splice(index, 1);
        }
    };

    $scope.searchComponent = function(query) {
        return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_COMPONENTS?query=" + query.toUpperCase() + "*").then(function(response) {
            return response.data.COMPONENTS;
        });
    };

    $scope.searchSoftwareComponent = function(query) {
        return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_SOFTWARE_COMPONENTS?query=" + query.toUpperCase() + "*").then(function(response) {
            return response.data.COMPONENTS;
        });
    };

    $scope.searchPackage = function(query) {
        return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_DEVCLASSES?query=" + query.toUpperCase() + "*").then(function(response) {
            return response.data.PACKAGES;
        });
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
