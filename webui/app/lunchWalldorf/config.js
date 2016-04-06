angular.module('app.lunchWalldorf').service("app.lunchWalldorf.configservice", ["bridgeDataService", function (bridgeDataService) {

	this.configItem = {
		language : 'de',
		boxSize : '1'
	};

	var that = this;
	bridgeDataService.getAppsByType("app.lunchWalldorf")[0].returnConfig = function() {
		return that;
	};
}]);
