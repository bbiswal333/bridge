angular.module("app.internalIncidentsMitosis")
	.service("app.internalIncidentsMitosis.dataService", ["$http", "$q", "$window",
	function ($http, $q, $window) {
		var AppData = (function() {
			function toDate(dateString) {
				if(!dateString) {
					return undefined;
				}

				var matches = dateString.match(/\/Date\(([0-9]*)\)\//);
				if(!matches) {
					return undefined;
				}
	        	var match = matches[1];
	        	if(!match) {
	        		return undefined;
	        	}

	        	return new Date(parseInt(match)).toISOString().replace(/[^0-9]/g, "");
	        }

	        function getFilterFromConfig(config) {
	        	var filter = "";
	        	if(config.systems.length > 0 || config.programs.length > 0) {
	        		filter += "( (";
	        		filter += config.systems.map(function(system) {
	        			return "II_SYSTEM_ID eq '" + system + "'";
	        		}).join(' or ');
	        		if(config.systems.length > 0 && config.programs.length > 0) {
	        			filter += ") or (";
	        		}
	        		filter += config.programs.map(function(program) {
	        			var result = "(TP_PROGRAM eq '" + program.TP_PROGRAM + "'";
	        			if(program.SYSTEMS && program.SYSTEMS.length > 0) {
	        				result += " and (" + program.SYSTEMS.map(function(system) {
	        					return "II_SYSTEM_ID eq '" + system + "'";
	        				}).join(" or ");
	        				result += ")";
	        			}
	        			result += ")";
	        			return result;
	        		}).join(' or ');
	        		filter += ")";
					if(config.components.length > 0) {
						filter += ") and ";
					} else {
						filter += ")";
					}
	        	}
	        	if(config.components.length > 0) {
	        		filter += "(";
	        		filter += config.components.map(function(component) {
	        			if(component.indexOf('*') >= 0) {
	        				return "startswith(II_CATEGORY, '" + component.replace(/\*/gi, '') + "')";
	        			} else {
	        				return "II_CATEGORY eq '" + component + "'";
	        			}
	        		}).join(' or ');
	        		filter += ")";
	        	}
	        	filter += " and II_STATUS_ID ne 'E0009' and II_STATUS_ID ne 'E0013' and II_STATUS_ID ne 'E0005'";
				return filter;
	        }

	        function transform(incident) {
	        	incident.PRIORITY_KEY = incident.II_PRIORITY_TEXT.substring(0, 1);
	            incident.PRIORITY_DESCR = incident.II_PRIORITY_TEXT.substring(2);
	        	incident.II_CREATED_AT = toDate(incident.II_CREATED_AT);
	        	incident.II_CHANGED_AT = toDate(incident.II_CHANGED_AT);
	        	incident.II_MPT_EXPIRY_DATE = toDate(incident.II_MPT_EXPIRY_DATE);
	        	return incident;
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
										that.prio1.push(transform(incident));
										break;
									case "3-High":
										that.prio2.push(transform(incident));
										break;
									case "5-Medium":
										that.prio3.push(transform(incident));
										break;
									case "9-Low":
										that.prio4.push(transform(incident));
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
