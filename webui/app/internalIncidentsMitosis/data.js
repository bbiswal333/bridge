angular.module("app.internalIncidentsMitosis")
	.service("app.internalIncidentsMitosis.dataService", ["$http", "$q", "$window", "$timeout",
	function ($http, $q, $window, $timeout) {
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
	        	var deferred = $q.defer();

	        	function buildFilterAndReturn(akhResponsiblesComponents) {
	        		var filter = {programFilter: "", systemFilter: "", processorFilter: "", componentFilter: ""};
		        	filter.programFilter += config.programs.map(function(program) {
		        		return (program.exclude ? "!" : "") + program.TP_PROGRAM + ";" + addSystems(program);
		        	}).join("|");
		        	filter.systemFilter += (config.excludeSystems ? "!" : "") + config.systems.join(";").toUpperCase();

		        	filter.processorFilter += (config.excludeProcessors ? "!" : "") + config.processors.map(function(processor) { return processor.BNAME; }).join(";");

		        	filter.componentFilter += config.components.concat(akhResponsiblesComponents).map(function(component) {
		        		if(component.exclude) {
		        			return "!" + component.value.toUpperCase();
		        		} else {
		        			return component.value.toUpperCase();
		        		}
		        	}).join(";");
		        	deferred.resolve(filter);
	        	}

	        	if(config.akhResponsibles.length > 0) {
	        		$q.all(config.akhResponsibles.map(function(responsible) {
	        			return responsible.getComponents();
	        		})).then(function(results) {
	        			buildFilterAndReturn([].concat.apply([], results).map(function(component) {
	        				component.exclude = false;
	        				return component;
	        			}));
	        		});
	        	} else {
	        		$timeout(function() {
	        			buildFilterAndReturn([]);
	        		});
	        	}

				return deferred.promise;
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
						var url = "https://sithdb.wdf.sap.corp/irep/reporting/internalIncidents/incidents.xsjs?origin=" + $window.location.origin;
						$http({method: 'POST', url: url, withCredentials: true, data: getFilterFromConfig(config)}).success(function(data){
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