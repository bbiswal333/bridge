/*globals jQuery*/
﻿angular.module('app.atc').appAtcSettings = ['$filter', 'ngTableParams', 'app.atc.configservice', '$scope', '$window', '$http', function ($filter, ngTableParams, appAtcConfig, $scope, $window, $http) {
    $scope.srcSystem = "";
    $scope.devClass = "";

    $scope.config = appAtcConfig.getConfigForAppId($scope.boxScope.metadata.guid);
    $scope.currentConfigValues = appAtcConfig.getConfigForAppId($scope.boxScope.metadata.guid).newItem();

    $scope.currentConfigValues.onlyInProcess = true;
    $scope.bShowSelectionDetails = false;

    $scope.closeForm = function () {
        $scope.$emit('closeSettingsScreen');
    };

    $scope.onSelectSystem = function(value) {
        for(var i = 0, length = $scope.currentConfigValues.srcSystems.length; i < length; i++) {
            if($scope.currentConfigValues.srcSystems[i].value === value) {
                return;
            }
        }

        if(value !== "") {
            $scope.currentConfigValues.srcSystems.push({value: value});
            $scope.currentConfigValues.srcSystem = "";
        }
    };

    $scope.removeSystem = function(value, configItem) {
        configItem.srcSystems.splice(configItem.srcSystems.indexOf(value), 1);
    };

    $scope.onSelectPackage = function(value) {
        for(var i = 0, length = $scope.currentConfigValues.devClasses.length; i < length; i++) {
            if($scope.currentConfigValues.devClasses[i].value === value) {
                return;
            }
        }

        if(value !== "") {
            $scope.currentConfigValues.devClasses.push({value: value});
            $scope.currentConfigValues.devClass = "";
        }
    };

    $scope.removePackage = function(value, configItem) {
        configItem.devClasses.splice(configItem.devClasses.indexOf(value), 1);
    };

    $scope.onSelectAKHComponent = function(value) {
        for(var i = 0, length = $scope.currentConfigValues.components.length; i < length; i++) {
            if($scope.currentConfigValues.components[i].value === value || (value.PS_POSID && $scope.currentConfigValues.components[i].value === value.PS_POSID)) {
                return;
            }
        }

        if(value !== "" || (value.PS_POSID && value.PS_POSID !== "")) {
            $scope.currentConfigValues.components.push({value: value.PS_POSID ? value.PS_POSID : value});
            $scope.currentConfigValues.component = "";
        }
    };

    $scope.removeAKHComponent = function(value, configItem) {
        configItem.components.splice(configItem.components.indexOf(value), 1);
    };

    $scope.onSelectSoftwareComponent = function(value) {
        for(var i = 0, length = $scope.currentConfigValues.softwareComponents.length; i < length; i++) {
            if($scope.currentConfigValues.softwareComponents[i].value === value) {
                return;
            }
        }

        if(value !== "") {
            $scope.currentConfigValues.softwareComponents.push({value: value});
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

    function stopEditing() {
        $scope.editMode = false;
        $scope.currentConfigValues = appAtcConfig.getConfigForAppId($scope.boxScope.metadata.guid).newItem();
        $scope.bShowSelectionDetails = false;
    }

    $scope.save_click = function() {
        $scope.config.configItems[$scope.config.configItems.indexOf($scope.editedConfigItem)] = $scope.currentConfigValues;
        stopEditing();
    };

    $scope.cancel_click = function() {
        stopEditing();
    };

    $scope.rss_click = function (configItem) {
        configItem.getQueryString().then(function(queryString) {
            $window.open('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + queryString + '&format=rss');
        });
    };

    $scope.copy_click = function (configItem) {
        jQuery.extend($scope.currentConfigValues,configItem);
        $scope.bShowSelectionDetails = true;
    };

    $scope.edit_click = function(configItem) {
        $scope.editMode = true;
        $scope.editedConfigItem = configItem;
        $scope.currentConfigValues = angular.copy(configItem);
        $scope.bShowSelectionDetails = true;
    };

    $scope.remove_click = function (configItem) {
        var index = $scope.config.configItems.indexOf(configItem);
        if (index > -1) {
            $scope.config.configItems.splice(index, 1);
        }
    };

    $scope.searchComponent = function(query) {
        return $http.get("https://mithdb.wdf.sap.corp/irep/reporting/internalIncidents/components.xsodata/Component?$format=json&$top=10&$filter=startswith(PS_POSID, '" + query.toUpperCase() + "')").then(function(response) {
            return response.data.d.results;
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
        $scope.config.getQueryString().then(function(queryString) {
            $window.open('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + queryString + '&format=rss');
        });
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
