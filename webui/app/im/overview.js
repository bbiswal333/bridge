angular.module('app.im', ['ngTable']);

angular.module('app.im').factory("app.im.configservice", function ()
{
    //set the default configuration object
    var config = {};
    config.data = {};
    config.data.settings = {};
    config.data.selection = {};
    config.data.settings.ignore_author_action = true;
    config.data.selection.sel_components = true;
    config.data.selection.colleagues = false;
    config.data.selection.assigned_me = false;
    config.data.selection.created_me = false;
    return config;
});

angular.module('app.im').directive('app.im', ['app.im.configservice', function (configservice)
{
    return {
        restrict: 'E',
        templateUrl: 'app/im/overview.html',
        link: function ($scope)
        {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.data !== undefined)
            {
                configservice.data = $scope.appConfig.data;
            }
        }
    };
}]);

angular.module('app.im').controller('app.im.directiveController', ['$scope', '$http', 'app.im.ticketData', 'app.im.configservice','bridgeDataService', 'bridgeConfig',
    function Controller($scope, $http, ticketData, configservice, bridgeDataService, bridgeConfig) {

        $scope.box.boxSize = "1";
        $scope.box.settingScreenData = {
            templatePath: "im/settings.html",
            controller: angular.module('app.im').appImSettings,
            id: $scope.boxId
        };

        $scope.box.returnConfig = function() {
            return configservice;
        };

        $scope.prios = ticketData.prios;
        $scope.$parent.titleExtension = " - Internal Messages";
        $scope.dataInitialized = ticketData.isInitialized;
        $scope.showNoMessages = false;

        function setNoMessagesFlag() {
            if (ticketData.isInitialized.value === true && ($scope.prios[0].total + $scope.prios[1].total + $scope.prios[2].total + $scope.prios[3].total) === 0) {
                $scope.showNoMessages = true;
            } else {
                $scope.showNoMessages = false;
            }
        }

        $scope.$watch("prios", function () {
            setNoMessagesFlag();
        }, true);


        $scope.$watch('config', function (newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal)
            {
                ticketData.updatePrioSelectionCounts();

                // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                if (oldVal !== undefined) {
                    bridgeConfig.store(bridgeDataService);
                }
            }
        },true);

        if (ticketData.isInitialized.value === false) {
            var initPromise = ticketData.initialize();
            initPromise.then(function success() {
                setNoMessagesFlag();
                $scope.config = configservice;
            });
        }
        else{
            $scope.config = configservice;
        }

        $scope.box.reloadApp(ticketData.loadTicketData, 60 * 5);
}]);
