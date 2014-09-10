angular.module('bridge.service').service('bridge.service.bridgeSettingsModalService', [ "$modal", "bridgeDataService", function($modal, bridgeDataService){
    return {
        show_settings: function(appId, templatePath, settingsController, boxScope)
        {
            var appInstance;
            if (_.isNumber(appId)) {
                appInstance = bridgeDataService.getAppById(appId);
            } else {
                appInstance = bridgeDataService.getAppByModuleName(appId);
            }

            return $modal.open({
                templateUrl: 'view/settings.html',
                windowClass: 'settings-dialog',
                controller: angular.module('bridge.app').settingsController,
                resolve: {
                    templateString: function () {

                        if (_.isUndefined(templatePath)) {
                            return appInstance.scope.box.settingScreenData.templatePath;
                        } else {
                            return templatePath;
                        }
                    },
                    templateController: function () {
                        if (_.isUndefined(templatePath)) {
                            return appInstance.scope.box.settingScreenData.controller;
                        }  else {
                            return settingsController;
                        }
                    },
                    boxController: function () {
                        return appInstance;
                    },
                    boxScope: function () {
                        if (_.isUndefined(boxScope)) {
                            return appInstance.scope;
                        } else {
                            return boxScope;
                        }
                    }
                }
            });

        }
    };
} ]);

