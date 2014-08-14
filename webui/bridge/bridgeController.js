angular.module('bridge.app').controller('bridgeController',
    ['$scope', '$http', '$window', '$route', '$location', '$timeout', '$q', '$log', 'bridgeDataService', 'bridgeConfig', 'sortableConfig', "notifier", "$modal", 'bridgeInBrowserNotification', "bridge.service.bridgeDownload", "bridge.diagnosis.logService",
    function ($scope, $http, $window, $route, $location, $timeout, $q, $log, bridgeDataService, bridgeConfig, sortableConfig, notifier, $modal, bridgeInBrowserNotification, bridgeDownloadService, logService) {

        $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
            if( newValue !== oldValue)
            {
                var paq = paq || [];
                paq.push(['trackPageView', newValue]);
            }
        });

        $scope.logMode = bridgeDataService.getLogMode();
        $scope.sendLog = function () {
            modalPromise = logService.showPreview();
            modalPromise.then(function resolved() {
                logService.sendLog(); 
            });
        };
        $scope.showLogModeWiki = function () {
            $window.open("https://github.wdf.sap.corp/bridge/bridge/wiki/Log-Mode");
        };

        $scope.getSidePane = function () {
            return $scope.sidePanel;
        };

        $scope.bridge_notifications_click = function () {
            $scope.sidePanel = 'view/bridgeNotifications.html';
            if ($scope.sideView === "notifications" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "notifications";
        };

        $scope.bridge_settings_click = function () {
            $scope.sidePanel = 'view/bridgeSettings.html';
            if ($scope.sideView === "settings" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
                if ($scope.show_settings === false) {
                    bridgeConfig.persistInBackend(bridgeDataService);
                }
            }
            $scope.sideView = "settings";
        };

        $scope.bridge_hide_settings = function () {
            if ($scope.show_settings === true) {
                $scope.show_settings = false;
                bridgeConfig.persistInBackend(bridgeDataService);
            }
        };

        $scope.bridge_feedback_click = function () {
            $scope.sidePanel = 'view/bridgeFeedback.html';
            if ($scope.sideView === "feedback" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "feedback";
        };

        $scope.bridge_github_click = function () {
            $scope.sidePanel = 'view/bridgeGithub.html';
            if ($scope.sideView === "github" || !$scope.show_settings) {
                $scope.show_settings = !$scope.show_settings;
            }
            $scope.sideView = "github";
        };

        $scope.show_download = bridgeDownloadService.show_download;

        $http.get(window.client.origin + '/client').success(function (data) {
            $scope.client = true;
        	window.client.available = true;
            window.client.os = data.os;

        }).error(function () {
            $scope.client = false;
            window.client.available = false;
        });

        if ($location.path() === "" || $location.path() === "/") {
            $scope.showLoadingAnimation = true;
        }

        window.debug = {
            resetConfig: function()
                        {
                bridgeDataService.toDefault();
                bridgeConfig.persistInBackend(bridgeDataService);
                        }
        };

        $scope.toggleDragging = function() {
            $scope.sortableOptions.disabled = !$scope.sortableOptions.disabled;
            if ($scope.sortableOptions.disabled) {
                $scope.sortableOptionsCaption = "Activate";
            } else {
                $scope.sortableOptionsCaption = "Deactivate";
            }

        };

        $scope.saveAppsSortable = function(){
          for (var i = 0; i < $scope.visible_apps.length; i++) {
                for(var j = 0; j < $scope.apps.length; j++)
                {
                    if($scope.apps[j].module_name === $scope.visible_apps[i].module_name)
                    {
                        $scope.apps[j].order = i;
                    }
                }
          }
          bridgeConfig.persistInBackend(bridgeDataService);
        };

        $scope.settings_click = function (boxId) {
            bridgeConfig.showSettingsModal(boxId);
        };

        $scope.overview_click = function () {
            $location.path('/');
            document.getElementById('overview-button').classList.add('selected');
            //document.getElementById('projects-button').classList.remove('selected');
        };

        $scope.projects_click = function () {
            $location.path('/projects');
            document.getElementById('overview-button').classList.remove('selected');
            document.getElementById('projects-button').classList.add('selected');
        };

        $scope.showSettingsModal = function (appId) {
            var appInstance = bridgeDataService.getAppById(appId);

            $scope.modalInstance = $modal.open({
                templateUrl: 'view/settings.html',
                windowClass: 'settings-dialog',
                controller: angular.module('bridge.app').settingsController,
                resolve: {
                    templateString: function () {
                        return appInstance.scope.box.settingScreenData.templatePath;
                    },
                    templateController: function () {
                        return appInstance.scope.box.settingScreenData.controller;
                    },
                    boxController: function () {
                        return appInstance;
                    },
                    boxScope: function () {
                        return appInstance.scope;
                    }
                }
            });

            // save the config in the backend no matter if the result was ok or cancel -> we have no cancel button at the moment, but clicking on the faded screen = cancel
            function onModalClosed() {
                bridgeConfig.persistInBackend(bridgeDataService);
                $scope.modalInstance = null;
            }
            this.modalInstance.result.then(onModalClosed, onModalClosed);
        };

        $scope.apps = [];
        $scope.$watch('apps', function () {
            if (!$scope.visible_apps) {
                $scope.visible_apps = [];
            }
            if ($scope.apps)
            {
                for (var i = 0; i < $scope.apps.length; i++)
                {
                    var module_visible = false;
                    if ($scope.apps[i].show)
                    {
                        for(var j = 0; j < $scope.visible_apps.length; j++)
                        {
                            if( $scope.apps[i].module_name === $scope.visible_apps[j].module_name ){
                                module_visible = true;
                            }
                        }
                       if(!module_visible)
                        {
                            var push_app = $scope.apps[i];
                            if (push_app.order === undefined) {
                                push_app.order = $scope.visible_apps.length;
                            }
                            $scope.visible_apps.push(push_app);
                        }
                    }
                    else
                    {
                        var module_index = 0;
                        for(var k = 0; k < $scope.visible_apps.length; k++)
                        {
                            if( $scope.apps[i].module_name === $scope.visible_apps[k].module_name )
                            {
                                module_visible = true;
                                module_index = k;
                            }
                        }
                       if(module_visible)
                        {
                            $scope.visible_apps.splice(module_index, 1);
                        }
                    }
                }


                $scope.visible_apps.sort(function (app1, app2){
                    if (app1.order < app2.order) {
                        return -1;
                    }
                    if (app1.order > app2.order) {
                        return 1;
                    }
                    return 0;
                });

            }
        }, true);

        $scope.$on('closeSettingsScreenRequested', function () {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
        });

        $scope.$on('bridgeConfigLoadedReceived', function (event) {
            bridgeInBrowserNotification.setScope($scope);
            $scope.sortableOptions = sortableConfig.sortableOptions;
            $scope.sortableOptions.disabled = true; // always allow sorting
            $scope.sortableOptionsCaption = "Activate";
            $scope.sortableOptions.stop = $scope.saveAppsSortable;
            $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
            $scope.temporaryData = bridgeDataService.getTemporaryData();
            $scope.apps = bridgeDataService.getAppMetadataForProject(0);
            if ($location.$$host === 'bridge-master.mo.sap.corp') {
                $scope.isTestInstance = true;
            }
            $scope.configLoadingFinished = true;
            $scope.showLoadingAnimation = false;
        });

    }
]);

angular.module('bridge.app').filter("decodeIcon", function () {
    return function (str) {
        if (str === undefined) {
            return "";
        }
        var el = document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    };
});
