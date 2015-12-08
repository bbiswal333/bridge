angular.module("app.internalIncidentsMitosis")
	.service("app.internalIncidentsMitosis.dataService", ["$http", "$q", "$window",
	function ($http, $q, $window) {
		var AppData = (function() {
			function toDate(dateString) {
				if(dateString) {
					return new Date(dateString);
				} else {
					return "";
				}
	        }

	        function addSystems(program) {
	        	var result = "";
	        	if(program.SYSTEMS.length > 0) {
	        		for(var i = 0, length = program.SYSTEMS.length; i < length; i++) {
	        			if(program.SYSTEMS[i].exclude) {
	        				result += program.SYSTEMS[i].value + ";";
	        			}
	        		}
	        	}
	        	return result;
	        }

	        function getFilterFromConfig(config) {
	        	var filter = "";
	        	filter += "programFilter=";
	        	filter += config.programs.map(function(program) {
	        		return (program.exclude ? "!" : "") + program.TP_PROGRAM + ";" + addSystems(program);
	        	}).join("|");
	        	filter += "&systemFilter=";
	        	filter += (config.excludeSystems ? "!" : "") + config.systems.join(";");

	        	filter += "&processorFilter=";
	        	filter += (config.excludeProcessors ? "!" : "") + config.processors.map(function(processor) { return processor.BNAME; }).join(";");

	        	filter += "&componentFilter=";
	        	filter += config.components.map(function(component) {
	        		if(component.exclude) {
	        			return "!" + component.value;
	        		} else {
	        			return component.value;
	        		}
	        	}).join(";");
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
				var that = this;

				this.loadData = function(config) {
					var deferred = $q.defer();
					if(config.components.length === 0 && config.systems.length === 0 && config.programs.length === 0 && config.processors.length === 0) {
						that.prio1 = [];
						that.prio2 = [];
						that.prio3 = [];
						that.prio4 = [];
						deferred.resolve();
					} else {
						var url = "https://mithdb.wdf.sap.corp/irep/reporting/internalIncidents/incidents.xsjs?" + getFilterFromConfig(config) + "&origin=" + $window.location.origin;
						$http.get(url).success(function(data){
							that.limit = data.limit;
							that.limitExceeded = data.limitExceeded;
							that.prio1 = [];
							that.prio2 = [];
							that.prio3 = [];
							that.prio4 = [];
							data.incidents.map(function(incident) {
								switch(incident.II_PRIORITY_TEXT) {
									case "1-Very High":
										that.prio1.push(transform(incident));
										break;
									case "2-High":
										that.prio2.push(transform(incident));
										break;
									case "3-Medium":
										that.prio3.push(transform(incident));
										break;
									case "4-Low":
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
