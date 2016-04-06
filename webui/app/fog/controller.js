(function() {
    'use strict';

    function Controller($scope, $location, data, config) {

        var expandButton;

        // If overview
        if($scope.box) {
            expandButton = {
                iconCss: "fa-expand",
                title: "Expand",
                callback: function () {
                    $location.path('/fog/detail/');
                }
            };

            $scope.box.boxSize = 2;
            $scope.box.headerIcons = [
                expandButton
            ];
            $scope.box.settingsTitle = "Settings";
            $scope.box.settingScreenData = {
                templatePath: 'fog/settings/template.html',
                controller: angular.noop,
                id: $scope.boxId
            };
            config.initialize($scope.metadata.guid);
        }

        // Get cached text or calculate initial value.
        // Allows to share text between overview and detail views.
        this.text = data.get();

        // Read persisted configuration and merge it with defaults
        if($scope.appConfig) {
            angular.extend(config, $scope.appConfig);
        }

        // Put configuration to scope
        $scope.config = config;

        this.hideWelcome = function () {
            config.welcome = false;
            $scope.$emit('closeSettingsScreen');
        };

        this.clear = function () {
            // Clear model/view
            this.text = '';
            // Clear data service cache
            data.clear();
        };

        this.save = function () {
            $scope.$emit('closeSettingsScreen');
        };
    }

    angular.module('app.fog').controller('app.fog.controller', [
        '$scope',
        '$location',
        'app.fog.data',
        'app.fog.config',
        Controller
    ]);

}());
