angular.module("app.transportNew")
	.service("app.transportNew.dataService", ["$http", "$q", "$window",
	function ($http, $q, $window) {
		var AppData = (function() {
			function toDate(dateString) {
	        	if(dateString) {
	        		return new Date(dateString);
	        	} else {
	        		return new Date();
	        	}
	        }

			return function() {
				this.loadData = function(config) {
					var deferred = $q.defer();
					var url = 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_TRANSPORTS?components=' + config.components.join(";") + '&systems=' + config.systems.join(";") + '&owners=' + config.owners.map(function(owner) { return owner.selector; }).join(';') + '&origin=' + $window.location.origin;
					var that = this;
					var thresholdDaysAgo = new Date(new Date().setDate(new Date().getDate() - config.openTransportThreshold));
					thresholdDaysAgo.setHours(0);
					thresholdDaysAgo.setMinutes(0);
					thresholdDaysAgo.setSeconds(0);
					thresholdDaysAgo.setMilliseconds(0);
					$http.get(url).success(function(data){
						that.openTransports = [];
						that.transportsOpenForLongerThanThreshold = [];
						data.TRANSPORTS.map(function(transport) {
							transport.FIRST_OCCURENCE = transport.FIRST_OCCURENCE.substring(0, 4) + "-" + transport.FIRST_OCCURENCE.substring(4, 6) + "-" + transport.FIRST_OCCURENCE.substring(6, 8);
							if(!transport.PARENT_TRANSPORT && (transport.TYPE === "K" || transport.TYPE === "W" || transport.TYPE === "C" || transport.TYPE === "O" || transport.TYPE === "E" || transport.TYPE === "T" || transport.TYPE === "M" || transport.TYPE === "L")) {
								that.openTransports.push(transport);

								if(config.openTransportThreshold && toDate(transport.FIRST_OCCURENCE) < thresholdDaysAgo) {
									that.transportsOpenForLongerThanThreshold.push(transport);
								}
							}
						});
						deferred.resolve();
					});
					return deferred.promise;
				};
			};
		})();

		var instances = {};

		this.getInstanceFor = function(appId) {
			if(instances[appId] === undefined) {
				instances[appId] = new AppData();
			}

			return instances[appId];
		};
}]);
