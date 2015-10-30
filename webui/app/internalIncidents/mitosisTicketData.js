angular.module("app.internalIncidents")
	.service("app.internalIncidents.mitosisTicketData", ["$http", "$q", "$window", "app.internalIncidents.configservice",
	function ($http, $q, $window, configService) {
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
	        	if(config.data.systems.length > 0 || config.data.programs.length > 0) {
	        		filter += "( (";
	        		filter += config.data.systems.map(function(system) {
	        			return "II_SYSTEM_ID eq '" + system + "'";
	        		}).join(' or ');
	        		if(config.data.systems.length > 0 && config.data.programs.length > 0) {
	        			filter += ") or (";
	        		}
	        		filter += config.data.programs.map(function(program) {
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
					if(config.data.components.length > 0) {
						filter += ") and ";
					} else {
						filter += ")";
					}
	        	}
	        	if(config.data.components.length > 0) {
	        		filter += "(";
	        		filter += config.data.components.map(function(component) {
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

			return function(appId) {
				var config = configService.getConfigForAppId(appId);
				var that = this;

				this.prios = [{
	                key: "1", description: "Very High", active: false, total: 0
	            }, {
	                key: "3", description: "High", active: false, total: 0
	            }, {
	                key: "5", description: "Medium", active: false, total: 0
	            }, {
	                key: "9", description: "Low", active: false, total: 0
	            }];

				this.isInitialized = {value: false};

				this.loadTicketData = function() {
					this.tickets = [];
					var deferred = $q.defer();
					if(config.data.components.length === 0 && config.data.systems.length === 0 && config.data.programs.length === 0) {
						that.calculateTotals();
						deferred.resolve();
					} else {
						var url = "https://mithdb.wdf.sap.corp/irep/reporting/bridge/internalIncidents/incidents.xsodata/Incidents?$format=json&$filter=" + getFilterFromConfig(config) + "&origin=" + $window.location.origin;
						$http.get(url).success(function(data){
							that.tickets = data.d.results;
							that.calculateTotals();
							deferred.resolve();
						});
					}
					return deferred.promise;
				};

				this.calculateTotals = function() {
					that.prios[0].total = 0;
					that.prios[1].total = 0;
					that.prios[2].total = 0;
					that.prios[3].total = 0;
					this.tickets.map(function(incident) {
						if(incident.II_STATUS_ID === "E0004" && config.data.ignoreAuthorAction) {
							return;
						}
						switch(incident.II_PRIORITY_TEXT.substring(0, 1)) {
							case that.prios[0].key:
								that.prios[0].total++;
								break;
							case that.prios[1].key:
								that.prios[1].total++;
								break;
							case that.prios[2].key:
								that.prios[2].total++;
								break;
							case that.prios[3].key:
								that.prios[3].total++;
								break;
						}
					});
				};

				this.initialize = function (sAppIdentifier) {
	                this.sAppIdentifier = sAppIdentifier;

	                var loadTicketPromise = this.loadTicketData();
	                loadTicketPromise.then(function success() {
	                    that.isInitialized.value = true;
	                });

	                return loadTicketPromise;
	            };

	            this.getRelevantTickets = function() {
	            	var results = [];
	            	this.tickets.map(function(incident) {
	            		if(incident.II_STATUS_ID === "E0004" && config.data.ignoreAuthorAction) {
							return;
						}
	            		results.push({
	            			OBJECT_ID: incident.OBJECT_ID,
	            			PRIORITY_KEY: incident.II_PRIORITY_TEXT.substring(0, 1),
	            			PRIORITY_DESCR: incident.II_PRIORITY_TEXT.substring(2),
	            			CATEGORY: incident.II_CATEGORY,
	            			STATUS_DESCR: incident.II_STATUS_TEXT,
	            			REPORTER_ID: incident.II_REPORTER_ID,
	            			PROCESSOR_ID: incident.II_PROCESSOR_ID,
	            			CREATE_DATE: toDate(incident.II_CREATED_AT),
	            			CHANGE_DATE: toDate(incident.II_CHANGED_AT),
	            			DESCRIPTION: incident.II_DESCRIPTION,
	            			MPT_EXPIRY: toDate(incident.II_MPT_EXPIRY_DATE)
	            		});
	            	});
	            	return results;
	            };
			};
		})();

		var instances = {};

		this.getInstanceForAppId = function(appId) {
			if(instances[appId] === undefined) {
				instances[appId] = new AppData(appId);
			}

			return instances[appId];
		};
}]);
