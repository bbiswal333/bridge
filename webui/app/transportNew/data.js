angular.module("app.transportNew")
	.service("app.transportNew.dataService", ["$http", "$q", "$window",
	function ($http, $q, $window) {
		var AppData = (function() {
			return function() {
				this.loadData = function(config) {
					var deferred = $q.defer();
					var url = 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_TRANSPORTS?components=' + config.components.join(";") + '&owners=' + config.owners.map(function(owner) { return owner.selector; }).join(';') + '&origin=' + $window.location.origin;
					var that = this;
					$http.get(url).success(function(data){
						that.openTransports = [];
						data.TRANSPORTS.map(function(transport) {
							transport.FIRST_OCCURENCE = transport.FIRST_OCCURENCE.substring(0, 4) + "-" + transport.FIRST_OCCURENCE.substring(4, 6) + "-" + transport.FIRST_OCCURENCE.substring(6, 8);
							if(!transport.PARENT_TRANSPORT) {
								that.openTransports.push(transport);
							}
						});
						deferred.resolve();
					});
					return deferred.promise;
				};
			}
		})();

		var instances = {};

		this.getInstanceFor = function(appId) {
			if(instances[appId] === undefined) {
				instances[appId] = new AppData();
			}

			return instances[appId];
		}
}]);
