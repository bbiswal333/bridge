angular.module("app.internalIncidentsMitosis")
	.service("app.internalIncidentsMitosis.dataService", ["$http", "$q", "$window",
	function ($http, $q, $window) {
		var AppData = (function() {
			function toDate(dateString) {
	        	if(dateString) {
	        		return new Date(dateString);
	        	} else {
	        		return new Date();
	        	}
	        }

	        function getFilterFromConfig(config) {
	        	var filter = "";
	        	if(config.systems.length > 0 || config.programs.length > 0) {
	        		filter += "(";
	        		filter += config.systems.map(function(system) {
	        			return "II_SYSTEM_ID eq '" + system + "'";
	        		}).join(' or ');
	        		if(config.systems.length > 0 && config.programs.length > 0) {
	        			filter += " or ";
	        		}
	        		filter += config.programs.map(function(program) {
	        			return "TP_PROGRAM eq '" + program.TP_PROGRAM + "'";
	        		}).join(' or ');
	        		filter += ")";
					if(config.components.length > 0) {
						filter += " and ";
					}
	        	}
	        	if(config.components.length > 0) {
	        		filter += config.components.map(function(component) {
	        			if(component.indexOf('*')) {
	        				return "startswith(II_CATEGORY, '" + component.replace(/\*/gi, '') + "')";
	        			} else {
	        				return "II_CATEGORY eq '" + component + "'";
	        			}
	        		}).join(' and ');
	        	}
	        	filter += "and II_STATUS_ID ne 'E0009' and II_STATUS_ID ne 'E0013' and II_STATUS_ID ne 'E0005'";
				return filter;
	        }

			return function() {
				this.loadData = function(config) {
					this.prio1 = [];
					this.prio2 = [];
					this.prio3 = [];
					this.prio4 = [];
					var deferred = $q.defer();
					if(config.components.length === 0 && config.systems.length === 0 && config.programs.length === 0) {
						deferred.resolve();
					} else {
						var url = "https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/incidents.xsodata/Incidents?$format=json&$filter=" + getFilterFromConfig(config) + "&origin=" + $window.location.origin;
						var that = this;
						$http.get(url).success(function(data){
							data.d.results.map(function(incident) {
								switch(incident.II_PRIORITY_TEXT) {
									case "1-Very High":
										that.prio1.push(incident);
										break;
									case "3-High":
										that.prio2.push(incident);
										break;
									case "5-Medium":
										that.prio3.push(incident);
										break;
									case "9-Low":
										that.prio4.push(incident);
										break;
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
