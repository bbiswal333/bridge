angular.module('app.customerMessages').appImSettings = ['$scope','app.customerMessages.configservice', 'app.customerMessages.orgUnitData', 'app.customerMessages.ticketData',
	function ($scope, configservice, orgUnitData, ticketData) {
		$scope.config = configservice;
		$scope.orgUnits = orgUnitData.orgUnits;

		$scope.save_click = function () {
			$scope.$emit('closeSettingsScreen');
		};

		$scope.toggleNotificationDuration = function () {
			if (!configservice.data.settings.notificationDuration || configservice.data.settings.notificationDuration >= 0){
				configservice.data.settings.notificationDuration = -1;
			} else
			{
				configservice.data.settings.notificationDuration = null;
			}
		};

		angular.forEach($scope.orgUnits, function(scopeOrgUnit){
			if (_.some(configservice.data.settings.selectedOrgUnits, { 'ORGUNIT': scopeOrgUnit.ORGUNIT })){
				scopeOrgUnit.isSelected = true;
			}
		});

		$scope.$watch("orgUnits", function(newVal, oldVal){
			if (oldVal !== undefined){
				if (configservice.data.settings.selectedOrgUnits === undefined){
					configservice.data.settings.selectedOrgUnits = [];
				}
				configservice.data.settings.selectedOrgUnits.length = 0;
				angular.forEach($scope.orgUnits, function(orgUnit){
					if (orgUnit.isSelected){
						configservice.data.settings.selectedOrgUnits.push(orgUnit);
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
