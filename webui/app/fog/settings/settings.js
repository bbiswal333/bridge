(function() {
    'use strict';

    function SettingsDirective() {
        return {
            restrict: 'E',
            templateUrl: 'app/fog/settings/settings.html',
            controller: 'app.fog.controller',
            controllerAs: 'fog'
        };
    }

    angular.module('app.fog').directive('app.fog.settings', [
        SettingsDirective
    ]);

}());
