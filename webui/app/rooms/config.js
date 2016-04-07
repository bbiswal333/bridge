angular.module('app.rooms').service("app.rooms.configservice", ["bridgeDataService", function (bridgeDataService) {
	this.configItem = {};

	var that = this;
	bridgeDataService.getAppsByType("app.rooms")[0].returnConfig = function() {
		return angular.copy(that);
	};
}]);
