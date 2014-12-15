angular.module('app.customerMessages').appImSettings = ['$scope','app.customerMessages.configservice', 'app.customerMessages.orgUnitData', 'app.customerMessages.ticketData',
	function ($scope, configService, orgUnitDataService, ticketData) {
		var config = configService.getInstanceForAppId($scope.boxScope.metadata.guid);
		var orgUnitData = orgUnitDataService.getInstanceForAppId($scope.boxScope.metadata.guid);
		$scope.config = config;
		$scope.orgUnits = orgUnitData.orgUnits;

		$scope.save_click = function () {
			$scope.$emit('closeSettingsScreen');
		};

		$scope.toggleNotificationDuration = function () {
			if (!config.data.settings.notificationDuration || config.data.settings.notificationDuration >= 0){
				config.data.settings.notificationDuration = -1;
			} else
			{
				config.data.settings.notificationDuration = null;
			}
		};

		if (angular.isArray($scope.orgUnits)) {
			angular.forEach($scope.orgUnits, function (scopeOrgUnit) {
				if (_.some(config.data.settings.selectedOrgUnits, {'ORGUNIT': scopeOrgUnit.ORGUNIT})) {
					scopeOrgUnit.isSelected = true;
				}
			});
		}

		$scope.$watch("orgUnits", function(newVal, oldVal){
			if (oldVal !== undefined){
				if (config.data.settings.selectedOrgUnits === undefined){
					config.data.settings.selectedOrgUnits = [];
				}
				config.data.settings.selectedOrgUnits.length = 0;
				angular.forEach($scope.orgUnits, function(orgUnit){
					if (orgUnit.isSelected){
						config.data.settings.selectedOrgUnits.push(orgUnit);
					}
				});

				ticketData.loadTicketData();
			}
		}, true);

		$scope.$watch("config.data.settings.filterByOrgUnit", function(newVal, oldVal){
			if (newVal !== oldVal) {
				ticketData.loadTicketData();
			}
		});
}];
