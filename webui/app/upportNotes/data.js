angular.module('app.upportNotes').service("app.upportNotes.dataService", ['$q', 'app.upportNotes.configService', '$http', '$timeout', function ($q, configService, $http, $timeout) {
	var Data = (function() {

		function filterItems(aList, bExcluded) {
			var resultList = [];
			aList.map(function(item) {
				if(item.exclude === bExcluded) {
					resultList.push(item);
				}
			});
			return resultList;
		}

		function buildProgramFilterInclude(oProgram) {
			return "PRG_ID eq '" + oProgram.PRG_ID + "'";
		}

		function buildProgramFilterExclude(oProgram) {
			return "PRG_ID ne '" + oProgram.PRG_ID + "'";
		}

		function buildSoftwareComponentFilterInclude(oComponent) {
			return "PPMS_CV_SW_COMP_T eq '" + oComponent.Component + "'";
		}

		function buildSoftwareComponentFilterExclude(oComponent) {
			return "PPMS_CV_SW_COMP_T ne '" + oComponent.Component + "'";
		}

		function buildProcessorFilterInclude(oComponent) {
			return "CM_PROCESSOR eq '" + oComponent.UserID + "'";
		}

		function buildProcessorFilterExclude(oComponent) {
			return "CM_PROCESSOR ne '" + oComponent.UserID + "'";
		}

		function buildApplicationComponentFilterInclude(oComponent) {
			if(oComponent.Component.indexOf('*') === oComponent.Component.length - 1) {
				return "startswith(CM_ACRF_COMP, '" + oComponent.Component.substring(0, oComponent.Component.length - 1) + "')";
			} else {
				return "CM_ACRF_COMP eq '" + oComponent.Component + "'";
			}
		}

		function buildApplicationComponentFilterExclude(oComponent) {
			if(oComponent.Component.indexOf('*') === oComponent.Component.length - 1) {
				return "not startswith(CM_ACRF_COMP, '" + oComponent.Component.substring(0, oComponent.Component.length - 1) + "')";
			} else {
				return "CM_ACRF_COMP ne '" + oComponent.Component + "'";
			}
		}

		//CM_CREATION_DATE

		function getQueryString(oConfig) {
			return "(" + oConfig.getItems().map(function(oConfigItem) {
				var filters = [];

				var programsIncluded = filterItems(oConfigItem.getPrograms(), false);
				var programsExcluded = filterItems(oConfigItem.getPrograms(), true);
				var programsFilter = programsIncluded.map(buildProgramFilterInclude).join(" or ");
				programsFilter += programsExcluded.length > 0 ? (programsIncluded.length > 0 ? " and " : "") + programsExcluded.map(buildProgramFilterExclude).join(" and ") : "";

				var softwareComponentsIncluded = filterItems(oConfigItem.getSoftwareComponents(), false);
				var softwareComponentsExcluded = filterItems(oConfigItem.getSoftwareComponents(), true);
				var softwareComponentsFilter = softwareComponentsIncluded.map(buildSoftwareComponentFilterInclude).join(" or ");
				softwareComponentsFilter += softwareComponentsExcluded.length > 0 ? (softwareComponentsIncluded.length > 0 ? " and " : "") + softwareComponentsExcluded.map(buildSoftwareComponentFilterExclude).join(" and ") : "";

				var applicationComponentsIncluded = filterItems(oConfigItem.getApplicationComponents(), false);
				var applicationComponentsExcluded = filterItems(oConfigItem.getApplicationComponents(), true);
				var applicationComponentsFilter = applicationComponentsIncluded.map(buildApplicationComponentFilterInclude).join(" or ");
				applicationComponentsFilter += applicationComponentsExcluded.length > 0 ? (applicationComponentsIncluded.length > 0 ? " and " : "") + applicationComponentsExcluded.map(buildApplicationComponentFilterExclude).join(" and ") : "";

				var processorsIncluded = filterItems(oConfigItem.getProcessors(), false);
				var processorsExcluded = filterItems(oConfigItem.getProcessors(), true);
				var processorsFilter = processorsIncluded.map(buildProcessorFilterInclude).join(" or ");
				processorsFilter += processorsExcluded.length > 0 ? (processorsIncluded.length > 0 ? " and " : "") + processorsExcluded.map(buildProcessorFilterExclude).join(" and ") : "";

				if(oConfigItem.getCreationDate()) { filters.push("CM_CREATION_DATE gt datetime'" + oConfigItem.getCreationDate().toISOString() + "'"); }
				if(programsFilter) { filters.push(programsFilter); }
				if(softwareComponentsFilter) { filters.push(softwareComponentsFilter); }
				if(applicationComponentsFilter) { filters.push(applicationComponentsFilter); }
				if(processorsFilter) { filters.push(processorsFilter); }

				return filters.map(function(filter) { return "(" + filter + ")"; }).join(" and ");
			}).join(" or ") + ")";
		}

		function createBatchRequest(iPrio, oConfig, bDetails) {
			var requestBody = 	"--batch\r\n" +
								"Content-Type: application/http\r\n" +
								"Content-Transfer-Encoding: binary\r\n" +
								"\r\n" +
								"GET " + encodeURI("Items" + (bDetails ? "?$format=json&" : "/$count?") + "$filter=CM_PRIORITY eq '" + iPrio + "' and " + getQueryString(oConfig)) + " HTTP/1.1\r\n" +
								"\r\n" +
								"\r\n" +
								"--batch--";
			return $http.post("https://sithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/$batch", requestBody, {
				headers: {
					"Content-Type": "multipart/mixed; boundary=batch"
				}
			});
		}

		function parseSummary(sSummary) {
			var regexp = /\r\n\r\n(\d+)\r\n--[a-zA-Z0-9]{33}--\r\n$/gi;
			var results = regexp.exec(sSummary);
			return parseInt(results[1]);
		}

		function parseDetails(sSummary) {
			var regexp = /\r\n\r\n(.*)\r\n--[a-zA-Z0-9]{33}--\r\n$/gi;
			var results = regexp.exec(sSummary);
			return JSON.parse(results[1]);
		}

		return function(sAppId) {
			var that = this;
			var config = configService.getConfigForAppId(sAppId);
			config.initialize();

			this.summary = {};
			this.details = [];

			this.loadSummary = function() {
				var deferred = $q.defer();
				var queryString = getQueryString(config);

				if(queryString && queryString !== "()") {
					$q.all({
						prio1: createBatchRequest(1, config),
						prio2: createBatchRequest(2, config)
					}).then(function(result) {
						that.summary.prio1 = parseSummary(result.prio1.data);
						that.summary.prio2 = parseSummary(result.prio2.data);
						deferred.resolve();
					}, function() {
						deferred.reject();
					});
				} else {
					$timeout(function() {
						that.summary.prio1 = 0;
						that.summary.prio2 = 0;
						deferred.resolve();
					});
				}

				return deferred.promise;
			};

			this.loadDetails = function() {
				var deferred = $q.defer();

				this.details.length = 0;

				$q.all({
					prio1: createBatchRequest(1, config, true),
					prio2: createBatchRequest(2, config, true)
				}).then(function(result) {
					Array.prototype.push.apply(that.details, parseDetails(result.prio1.data).d.results);
					Array.prototype.push.apply(that.details, parseDetails(result.prio2.data).d.results);
					deferred.resolve();
				}, function() {
					deferred.reject();
				});

				return deferred.promise;
			};
		};
	})();

	var instances = {};
	this.getDataForAppId = function(sAppId) {
		if(!instances[sAppId]) {
			instances[sAppId] = new Data(sAppId);
		}

		return instances[sAppId];
	};
}]);
