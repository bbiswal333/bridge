angular.module('app.meetings').service("app.meetings.configservice", ["bridgeDataService", function (bridgeDataService) {

	this.configItem = {
		boxSize : '1',
		sAPConnectPreferredDialin : '+4969222210764',
		clipboard : false
	};

	var that = this;
	bridgeDataService.getAppsByType("app.meetings")[0].returnConfig = function() {
		return that;
	};
}]);
