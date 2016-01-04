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

	        function fillLeadingZero(str) {
				if(str.toString().length === 1) {
					return "0" + str;
				} else {
					return str;
				}
			}

	        function toABAPDate(date) {
	        	if(date) {
	        		if(!date.getFullYear) {
	        			date = new Date(date);
	        		}
	        		return date.getFullYear().toString() + fillLeadingZero(date.getMonth() + 1) + fillLeadingZero(date.getDate());
	        	} else {
	        		return "";
	        	}
	        }

	        function getSystemsString(systems) {
				return systems.map(function(system) {
					return (system.exclude ? "!" : "") + system.value.toUpperCase();
				}).join(";");
	        }

	        function getComponentsString(components) {
	        	return components.map(function(component) {
	        		return (component.exclude ? "!" : "") + component.value.toUpperCase();
	        	}).join(";");
	        }

	        function getOwnersString(owners) {
	        	return owners.map(function(owner) {
	        		return owner.selector.split(";").map(function(splittedOwner) {
	        			return (owner.exclude ? "!" : "") + splittedOwner;
	        		}).join(";");
	        	}).join(';');
	        }

			return function() {
				this.loadData = function(config) {
					var deferred = $q.defer();
					if(config.components.length === 0 && config.systems.length === 0 && config.owners.length === 0) {
						this.openTransports = [];
						this.transportsOpenForLongerThanThreshold = [];
						deferred.resolve();
					} else {
						var url = 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_TRANSPORTS?components=' + getComponentsString(config.components) + '&systems=' + getSystemsString(config.systems) + '&owners=' + getOwnersString(config.owners) + '&first_occurence=' + toABAPDate(config.firstOccurence) + '&origin=' + $window.location.origin;
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
					}
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
