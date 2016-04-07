angular.module("app.worldClock").service("app.worldClock.config", ["bridgeDataService", "$http", "lib.utils.calUtils", function(bridgeDataService, $http, calUtils) {
	var Location = (function() {
		return function(data) {
			var that = this;
			this.name = data.city ? data.city : data.name;
			this.zoneID = data.zoneID;
			this.timeOffset = data.timeOffset ? data.timeOffset : 0;

			(function loadTimeOffset() {
				$http.get('/api/worldClock/getOffset/?zoneID=' + data.zoneID).then(function(response) {
        			that.timeOffset = (response.data.offset * 1000) + (calUtils.now().getTimezoneOffset() / 60) * 1000 * 60 * 60;
        		});
			})();
		};
	})();

	var Config = (function() {
		return function(appId) {
			this.locations = [];

			var initialized = false;

			this.initialize = function() {
				if(initialized === true) {
					return;
				}

				var that = this;
				if(bridgeDataService.getAppConfigById(appId) !== undefined && bridgeDataService.getAppConfigById(appId).locations !== undefined) {
					bridgeDataService.getAppConfigById(appId).locations.map(function(location) {
						that.addLocation(location);
					});
					initialized = true;
				}
			};

			this.addLocation = function(data) {
				if(data.zoneID) {
					this.locations.push(new Location(data));
				}
			};

			this.removeLocation = function(location) {
				if(this.locations.indexOf(location) < 0) {
					return;
				}

				this.locations.splice(this.locations.indexOf(location), 1);
			};
		};
	})();

	var instances = {};

	this.getInstanceForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config(appId);
			bridgeDataService.getAppById(appId).returnConfig = function() {
				return instances[appId];
			};
		}

		return instances[appId];
	};
}]);
