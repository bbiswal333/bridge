angular.module('bridge.app').controller('bridgeController',
    ['$rootScope', '$scope', '$http', '$window', '$route', '$location', '$timeout', '$q', '$log', 'bridgeDataService', 'bridgeConfig', "notifier", 'bridgeInBrowserNotification', "bridge.service.bridgeDownload", "bridge.diagnosis.logService", "bridge.service.bridgeSettingsModalService", "bridge.appDragInfo",
    function ($rootScope, $scope, $http, $window, $route, $location, $timeout, $q, $log, bridgeDataService, bridgeConfig, notifier, bridgeInBrowserNotification, bridgeDownloadService, logService, bridgeSettingsModalService, dragInfo) {
        $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
            if( newValue !== oldValue)
            {
                var paq = paq || [];
                paq.push(['trackPageView', newValue]);
            }
        });

        $window.onbeforeunload = function(){
            bridgeConfig.store(bridgeDataService);
        };

        $scope.logMode = bridgeDataService.getLogMode();
        $scope.sendLog = function () {
            var modalPromise = logService.showPreview();
            modalPromise.then(function resolved() {
                logService.sendLog();
            });
        };
        $scope.showLogModeWiki = function () {
            $window.open("https://github.wdf.sap.corp/bridge/bridge/wiki/Log-Mode");
        };

        $scope.show_download = bridgeDownloadService.show_download;

        function parseVersionString(str)
        {
            if (typeof str !== 'string') { return false; }
            var x = str.split('.');
            // parse from string or default to 0 if can't parse
            var maj = parseInt(x[0]) || 0;
            var min = parseInt(x[1]) || 0;
            var pat = parseInt(x[2]) || 0;
            return {
                major: maj,
                minor: min,
                patch: pat
            };
        }

        function needsUpdate(needed_version, current_version)
        {
            var minimum = parseVersionString(needed_version);
            var running = parseVersionString(current_version);
            if (running.major !== minimum.major)
            {
                return (running.major < minimum.major);
            }
            else
            {
                if (running.minor !== minimum.minor)
                {
                    return (running.minor < minimum.minor);
                }
                else
                {
                    if (running.patch !== minimum.patch)
                    {
                        return (running.patch < minimum.patch);
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }

        $http.get($window.client.origin + '/client').success(function (data)
        {
            //version which is needed by the application
            var needs_version = "0.9.1";
            var has_version = "0.0.1";
            if(data.version !== undefined)
            {
                has_version = data.version;
            }

            //set global window attributes
            $window.client.has_version = has_version;
            $window.client.needs_version = needs_version;
            $window.client.os = data.os;

            if(!needsUpdate(needs_version, has_version))
            {
        	   $window.client.available = true;
               $window.client.outdated = false;
            }
            else
            {
                $window.client.available = false;
                $window.client.outdated = true;
                $scope.client_update = true;
            }

            $scope.client = $window.client.available;
            $log.log($window.client);

        }).error(function () {
            $window.client.available = false;
            $scope.client = $window.client.available;
            $scope.client_update = false;
            $log.log($window.client);
        });

        if ($location.path() === "" || $location.path() === "/") {
            $scope.showLoadingAnimation = true;
        }

        $window.debug = {
            resetConfig: function() {
                bridgeDataService.toDefault();
                bridgeConfig.store(bridgeDataService);
                bridgeConfig.persistInBackend();
            }
        };

        $scope.overview_click = function () {
            $location.path('/');
            $window.document.getElementById('overview-button').classList.add('selected');
            //document.getElementById('projects-button').classList.remove('selected');
        };

        $scope.projects_click = function () {
            $location.path('/projects');
            $window.document.getElementById('overview-button').classList.remove('selected');
            $window.document.getElementById('projects-button').classList.add('selected');
        };

        $scope.showSettingsModal = function (appId) {
			// bridgeSettingsModalService.show_settings(appId);
			$scope.modalInstance = bridgeSettingsModalService.show_settings(appId);

			// save the config in the backend no matter if the result was ok or cancel -> we have no cancel button at the moment, but clicking on the faded screen = cancel
			function onModalClosed() {
				bridgeConfig.store(bridgeDataService);
				$scope.modalInstance = null;
			}
			this.modalInstance.result.then(onModalClosed, onModalClosed);
        };

        $scope.$on('closeSettingsScreenRequested', function () {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
        });

        $scope.$on('bridgeConfigLoadedReceived', function () {
            bridgeInBrowserNotification.setScope($scope);
            $scope.dustBinModel = [];
            $scope.bridgeSettings = bridgeDataService.getBridgeSettings();
            $scope.temporaryData = bridgeDataService.getTemporaryData();
            $scope.projects = bridgeDataService.getProjects();
            if ($location.$$host === 'bridge-master.mo.sap.corp') {
                $scope.isTestInstance = true;
            }
            if ($location.$$host === 'localhost') {
                $scope.isLocal = true;
            }
            $scope.configLoadingFinished = true;
            $scope.showLoadingAnimation = false;
        });

        $scope.appDragInfo = dragInfo;






 

    }
]);

angular.module('bridge.app').filter("decodeIcon", function ($window) {
    return function (str) {
        if (str === undefined) {
            return "";
        }
        var el = $window.document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    };
});
