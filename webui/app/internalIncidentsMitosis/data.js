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

			function getRequestBody(sEntity, sQueryString, iPrio) {
				return  "--batch\r\n" +
						"Content-Type: application/http\r\n" +
						"Content-Transfer-Encoding: binary\r\n" +
						"\r\n" +
						"GET " + encodeURI(sEntity + "?$format=json&$filter=II_PRIORITY_ID eq " + (sEntity === 'Incident' || sEntity === 'IncidentDetails' ? iPrio : "'" + iPrio + "'") + " and " + sQueryString) + " HTTP/1.1\r\n" +
						"\r\n" +
						"\r\n" +
						"--batch--";
			}

			function parseData(sSummary) {
				var regexp = /\r\n\r\n(.*)\r\n--[a-zA-Z0-9]{33}--\r\n$/gi;
				var results = regexp.exec(sSummary);
				return JSON.parse(results[1]);
			}

			function createRequests(oQueryStrings, bSummary) {
				var oRequests = {};
				if(oQueryStrings.programQuery) {
					oRequests.programPrio1 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "IncidentByProgram" : "IncidentByProgramDetails", oQueryStrings.programQuery, 1), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
					oRequests.programPrio2 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "IncidentByProgram" : "IncidentByProgramDetails", oQueryStrings.programQuery, 3), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
					oRequests.programPrio3 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "IncidentByProgram" : "IncidentByProgramDetails", oQueryStrings.programQuery, 5), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
					oRequests.programPrio4 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "IncidentByProgram" : "IncidentByProgramDetails", oQueryStrings.programQuery, 9), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
				}
				if(oQueryStrings.nonProgramQuery) {
					oRequests.nonProgramPrio1 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "Incident" : "IncidentDetails", oQueryStrings.nonProgramQuery, 1), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
					oRequests.nonProgramPrio2 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "Incident" : "IncidentDetails", oQueryStrings.nonProgramQuery, 3), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
					oRequests.nonProgramPrio3 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "Incident" : "IncidentDetails", oQueryStrings.nonProgramQuery, 5), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
					oRequests.nonProgramPrio4 = $http.post("https://mithdb.wdf.sap.corp/oprr/intm/reporting/bridge/InternalIncidents.xsodata/$batch", getRequestBody(bSummary ? "Incident" : "IncidentDetails", oQueryStrings.nonProgramQuery, 9), {headers: {"Content-Type": "multipart/mixed; boundary=batch"}});
				}
				return oRequests;
			}

			function removeDuplicates(aArray) {
				var objectIDs = {};
				for(var i = 0, length = aArray.length; i < length; i++) {
					if(objectIDs[aArray[i].II_OBJECT_ID] === true) {
						aArray.splice(i, 1);
						length--;
						i--;
					} else {
						objectIDs[aArray[i].II_OBJECT_ID] = true;
					}
				}
			}

			function addItemsOfAToB(aArrayA, aArrayB) {
				aArrayA.map(function(item) {
					aArrayB.push(item);
				});
			}

			function doRequests(oDataObject, oQueryStrings, bSummary) {
				var deferred = $q.defer();
				$q.all(createRequests(oQueryStrings, bSummary)).then(function(results) {
					oDataObject.details.prio1.length = 0;
					oDataObject.details.prio2.length = 0;
					oDataObject.details.prio3.length = 0;
					oDataObject.details.prio4.length = 0;
					if(oQueryStrings.programQuery) {
						addItemsOfAToB(parseData(results.programPrio1.data).d.results, oDataObject.details.prio1);
						addItemsOfAToB(parseData(results.programPrio2.data).d.results, oDataObject.details.prio2);
						addItemsOfAToB(parseData(results.programPrio3.data).d.results, oDataObject.details.prio3);
						addItemsOfAToB(parseData(results.programPrio4.data).d.results, oDataObject.details.prio4);
					}
					if(oQueryStrings.nonProgramQuery) {
						addItemsOfAToB(parseData(results.nonProgramPrio1.data).d.results, oDataObject.details.prio1);
						addItemsOfAToB(parseData(results.nonProgramPrio2.data).d.results, oDataObject.details.prio2);
						addItemsOfAToB(parseData(results.nonProgramPrio3.data).d.results, oDataObject.details.prio3);
						addItemsOfAToB(parseData(results.nonProgramPrio4.data).d.results, oDataObject.details.prio4);
					}

					removeDuplicates(oDataObject.details.prio1);
					removeDuplicates(oDataObject.details.prio2);
					removeDuplicates(oDataObject.details.prio3);
					removeDuplicates(oDataObject.details.prio4);

					oDataObject.summary.prio1 = oDataObject.details.prio1.length;
					oDataObject.summary.prio2 = oDataObject.details.prio2.length;
					oDataObject.summary.prio3 = oDataObject.details.prio3.length;
					oDataObject.summary.prio4 = oDataObject.details.prio4.length;

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

			function getComponentsFilter(oConfig, akhResponsiblesComponents) {
				var componentFilter = [];
				var includedComponentFilters = [];
				var excludedComponentFilters = [];
				var totalComponents = oConfig.components;
				if(akhResponsiblesComponents && akhResponsiblesComponents.length > 0) {
					totalComponents = totalComponents.concat(akhResponsiblesComponents);
				}
				getIncluded(totalComponents).map(function(component) {
					if(component.value.indexOf("*") >= 0) {
						includedComponentFilters.push("startswith(II_CATEGORY, '" + component.value.replace('*', '') + "')");
					} else {
						includedComponentFilters.push("II_CATEGORY eq '" + component.value + "'");
					}
				});
				getExcluded(totalComponents).map(function(component) {
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

			function getProcessorsFilter(aFilters, aProcessors, bExcludeProcessors) {
				if(aProcessors.length > 0) {
					aFilters.push("(" + aProcessors.map(function(processor) {
						return "II_PROCESSOR_ID " + (bExcludeProcessors ? "ne" : "eq") + " '" + processor.BNAME + "'";
					}).join(bExcludeProcessors ? " and " : " or ") + ")");
				}
			}

			function getSystemFilter(aFilters, aSystems, bExcludeSystems) {
				if(aSystems.length > 0) {
					aFilters.push("(" + aSystems.map(function(system) {
						return "II_SYSTEM_ID " + (bExcludeSystems ? "ne" : "eq") + " '" + system + "'";
					}).join(bExcludeSystems ? " and " : " or ") + ")");
				}
			}

			function getQueryStrings(oConfig, akhResponsiblesComponents) {
				var queryStrings = {};
				var programFilters = [];
				var componentFilter = getComponentsFilter(oConfig, akhResponsiblesComponents);
				oConfig.programs.map(function(program) {
					if(!program.exclude) {
						programFilters.push("(TP_PROGRAM eq '" + program.TP_PROGRAM + "'" + getProgramSystemsFilter(program) + ")");
					}
				});

				if(programFilters.length > 0) {
					queryStrings.programQuery = "(" + programFilters.join(" or ") + ")" + (componentFilter ? " and (" + componentFilter + ")" : "");
				}
				if(oConfig.processors.length > 0 || oConfig.systems.length > 0 || (oConfig.components.length > 0 && oConfig.programs.length === 0)) {
					var orFilters = [];
					var andFilters = [];
					getProcessorsFilter(orFilters, oConfig.processors, oConfig.excludeProcessors);
					getSystemFilter(orFilters, oConfig.systems, oConfig.excludeSystems);
					if(orFilters.join(" or ")) {
						andFilters.push("(" + orFilters.join(" or ") + ")");
					}
					if(componentFilter) {
						andFilters.push("(" + componentFilter + ")");
					}
					queryStrings.nonProgramQuery = andFilters.join(" and ");
				}
				return queryStrings;
			}

			function loadData(oDataObject, oConfig, bSummary, deferred) {
				if(oConfig.akhResponsibles.length > 0) {
					$q.all(oConfig.akhResponsibles.map(function(responsible) {
	        			return responsible.getComponents();
	        		})).then(function(results) {
	        			doRequests(oDataObject, getQueryStrings(oConfig, Array.prototype.concat.apply([], results)), bSummary).then(function() {
	        				deferred.resolve();
	        			});
	        		});
				} else {
					doRequests(oDataObject, getQueryStrings(oConfig), bSummary).then(function() {
						deferred.resolve();
					});
				}
			}

			return function() {
				this.summary = {prio1: 0, prio2: 0, prio3: 0, prio4: 0};
				this.details = {prio1: [], prio2: [], prio3: [], prio4: []};
				this.loadSummary = function(config) {
					var deferred = $q.defer();
					if(config.components.length === 0 && config.systems.length === 0 && config.programs.length === 0 && config.processors.length === 0 && config.akhResponsibles.length === 0) {
						this.summary.prio1 = 0;
						this.summary.prio2 = 0;
						this.summary.prio3 = 0;
						this.summary.prio4 = 0;
						$timeout(function() { deferred.resolve(); });
					} else {
						loadData(this, config, true, deferred);
					}
					return deferred.promise;
				};

				this.loadDetails = function(config) {
					var deferred = $q.defer();
					if(config.components.length === 0 && config.systems.length === 0 && config.programs.length === 0 && config.processors.length === 0 && config.akhResponsibles.length === 0) {
						this.summary.prio1 = 0;
						this.summary.prio2 = 0;
						this.summary.prio3 = 0;
						this.summary.prio4 = 0;
						$timeout(function() { deferred.resolve(); });
					} else {
						loadData(this, config, false, deferred);
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
