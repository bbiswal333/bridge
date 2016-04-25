angular.module("app.internalIncidentsMitosis")
	.service("app.internalIncidentsMitosis.dataService", ["$http", "$q", "$window", "$timeout",
	function ($http, $q, $window, $timeout) {
		var AppData = (function() {
			function doDummyRequestInOrderToGetAroundIEBug() {
				$http({method: 'GET', url: "https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata", withCredentials: true}).success(function(){
					//Oh happy day...
				});
			}
			doDummyRequestInOrderToGetAroundIEBug();

			function getRequestBody(sQueryString, iPrio) {
				return  "--batch\r\n" +
						"Content-Type: application/http\r\n" +
						"Content-Transfer-Encoding: binary\r\n" +
						"\r\n" +
						"GET " + encodeURI("IncidentByProgram?$format=json&$filter=II_PRIORITY_ID eq '" + iPrio + "' and " + sQueryString) + " HTTP/1.1\r\n" +
						"\r\n" +
						"\r\n" +
						"--batch--";
			}

			function doRequests(oDataObject, sQueryString) {
				var deferred = $q.defer();
				//console.log(getRequestBody(sQueryString, 1));
				$q.all([
					$http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(sQueryString, 1), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}}),
					$http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(sQueryString, 2), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}}),
					$http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(sQueryString, 3), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}}),
					$http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(sQueryString, 4), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}})
				]).then(function() {
					oDataObject.summary.prio1 = 1;
					oDataObject.summary.prio2 = 2;
					oDataObject.summary.prio3 = 3;
					oDataObject.summary.prio4 = 4;
					deferred.resolve();
				});
				return deferred.promise;
			}

			function getProgramSystemsFilter(oProgram) {
				var excludedSystemsFilter = [];
				if(oProgram.SYSTEMS && oProgram.SYSTEMS.length > 0) {
					oProgram.SYSTEMS.map(function(oSystem) {
						if(oSystem.exclude) {
							excludedSystemsFilter.push("II_SYSTEM_ID ne '" + oSystem.value + "'");
						}
					});
				}
				if(excludedSystemsFilter.length > 0) {
					return " and " + excludedSystemsFilter.join(" and ");
				} else {
					return "";
				}
			}

			function getIncluded(aArray) {
				var result = [];
				aArray.map(function(item) {
					if(!item.exclude) {
						result.push(item);
					}
				});
				return result;
			}

			function getExcluded(aArray) {
				var result = [];
				aArray.map(function(item) {
					if(item.exclude) {
						result.push(item);
					}
				});
				return result;
			}

			function getComponentsFilter(oConfig) {
				var componentFilter = [];
				var includedComponentFilters = [];
				var excludedComponentFilters = [];
				getIncluded(oConfig.components).map(function(component) {
					if(component.value.indexOf("*") >= 0) {
						includedComponentFilters.push("startswith(II_CATEGORY, '" + component.value.replace('*', '') + "')");
					} else {
						includedComponentFilters.push("II_CATEGORY eq '" + component.value + "'");
					}
				});
				getExcluded(oConfig.components).map(function(component) {
					if(component.value.indexOf("*") >= 0) {
						excludedComponentFilters.push("not startswith(II_CATEGORY, '" + component.value.replace('*', '') + "')");
					} else {
						excludedComponentFilters.push("II_CATEGORY ne '" + component.value + "'");
					}
				});
				if(includedComponentFilters.length > 0) {
					componentFilter.push("(" + includedComponentFilters.join(" or ") + ")");
				}
				if(excludedComponentFilters.length > 0) {
					componentFilter.push(excludedComponentFilters.join(" and "));
				}
				return componentFilter.join(" and ");
			}

			function getQueryString(oConfig, akhResponsiblesComponents) {
				var programFilters = [];
				var componentFilter = getComponentsFilter(oConfig);
				oConfig.programs.map(function(program) {
					if(!program.exclude) {
						programFilters.push("(TP_PROGRAM eq '" + program.TP_PROGRAM + "'" + getProgramSystemsFilter(program) + ")");
					}
				});

				return "(" + programFilters.join(" or ") + ")" + (componentFilter ? " and (" + componentFilter + ")" : "");
			}

			function loadSummary(oDataObject, oConfig, deferred) {
				if(oConfig.akhResponsibles.length > 0) {
					$q.all(oConfig.akhResponsibles.map(function(responsible) {
	        			return responsible.getComponents();
	        		})).then(function(results) {
	        			doRequests(oDataObject, getQueryString(oConfig, results)).then(function() {
	        				deferred.resolve();
	        			});
	        		});
				} else {
					doRequests(oDataObject, getQueryString(oConfig)).then(function() {
						deferred.resolve();
					});
				}
			}

			return function() {
				this.summary = {prio1: 0, prio2: 0, prio3: 0, prio4: 0};
				this.loadSummary = function(config) {
					var deferred = $q.defer();
					if(config.components.length === 0 && config.systems.length === 0 && config.programs.length === 0 && config.processors.length === 0 && config.akhResponsibles.length === 0) {
						this.summary.prio1 = 0;
						this.summary.prio2 = 0;
						this.summary.prio3 = 0;
						this.summary.prio4 = 0;
						$timeout(function() { deferred.resolve(); });
					} else {
						loadSummary(this, config, deferred);
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
