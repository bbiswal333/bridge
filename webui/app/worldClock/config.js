angular.module("app.worldClock").service("app.worldClock.config", ["bridgeDataService", "$http", "lib.utils.calUtils", function(bridgeDataService, $http, calUtils) {
	var Location = (function() {
		return function(data) {
			var that = this;
			this.name = data.name;
			this.latitude = data.latitude;
			this.longitude = data.longitude;
			this.timeOffset = data.timeOffset ? data.timeOffset : 0;

			(function loadTimeOffset() {
				$http.get('/api/get?proxy=true&url=' + encodeURIComponent("http://www.earthtools.org/timezone/" + that.latitude + "/" + that.longitude)).then(function(timezoneData) {
        			that.timeOffset = (parseFloat(/<offset>(.*)<\/offset>/gi.exec(timezoneData.data)[1]) + (calUtils.now().getTimezoneOffset() / 60)) * 1000 * 60 * 60;
        		});
			})();
		};
	})();

	this.locations = [];

	var initialized = false;

	this.initialize = function(appId) {
		var that = this;
		if(bridgeDataService.getAppConfigById(appId) !== undefined && bridgeDataService.getAppConfigById(appId).locations !== undefined) {
			bridgeDataService.getAppConfigById(appId).locations.map(function(location) {
				that.addLocation(location);
			});
			initialized = true;
		}
	};

	this.addLocation = function(data) {
		this.locations.push(new Location(data));
	};

	this.removeLocation = function(location) {
		if(this.locations.indexOf(location) < 0) {
			return;
		}

		this.locations.splice(this.locations.indexOf(location), 1);
	};
}]);
