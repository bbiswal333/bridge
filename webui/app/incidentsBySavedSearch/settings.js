angular.module('app.incidentSavedSearch')
    .controller('app.incidentSavedSearch.settingsController', ["$scope", "$http", "app.incidentSavedSearch.configservice", "app.incidentSavedSearch.ticketData", "app.incidentSavedSearch.savedSearchData",
        function($scope, $http, configService, ticketDataService, savedSearchDataService){

            var config = configService.getConfigForAppId($scope.boxScope.metadata.guid);
            var savedSearchData = savedSearchDataService.getInstanceForAppId($scope.boxScope.metadata.guid);
            var ticketData = ticketDataService.getInstanceForAppId($scope.boxScope.metadata.guid);
            $scope.config = config;
            $scope.savedSearches = savedSearchData.savedSearches;

            if (angular.isArray($scope.savedSearches)) {
                angular.forEach($scope.savedSearches, function (savedSearch) {
                    if (savedSearch.GUID === config.data.selectedSearchGuid) {
                        savedSearch.isSelected = true;
                    }
                });
            }

            $scope.save_click = function () {
                $scope.$emit('closeSettingsScreen');
            };

            $scope.searchRadio_clicked = function(clickedSavedSearch){
                angular.forEach($scope.savedSearches, function(savedSearch){
                    savedSearch.isSelected = false;
                });

                clickedSavedSearch.isSelected = true;
                $scope.config.data.selectedSearchGuid = clickedSavedSearch.GUID;
                ticketData.loadTicketData();
            };
        }
    ]);
