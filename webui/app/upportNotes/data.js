angular.module('app.upportNotes').service("app.upportNotes.dataService", ['$q', 'app.upportNotes.configService', '$http', function ($q, configService, $http) {
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

		function getQueryString(oConfig) {
			return oConfig.getItems().map(function(oConfigItem) {
				var filters = [];

				var programsIncluded = filterItems(oConfigItem.getPrograms(), false);
				var programsExcluded = filterItems(oConfigItem.getPrograms(), true);
				var programsFilter = programsIncluded.map(buildProgramFilterInclude).join(" or ");
				programsFilter += programsExcluded.length > 0 ? " and " + programsExcluded.map(buildProgramFilterExclude).join(" and ") : "";

				var softwareComponentsIncluded = filterItems(oConfigItem.getSoftwareComponents(), false);
				var softwareComponentsExcluded = filterItems(oConfigItem.getSoftwareComponents(), true);
				var softwareComponentsFilter = softwareComponentsIncluded.map(buildSoftwareComponentFilterInclude).join(" or ");
				softwareComponentsFilter += softwareComponentsExcluded.length > 0 ? " and " + softwareComponentsExcluded.map(buildSoftwareComponentFilterExclude).join(" and ") : "";

				if(programsFilter) { filters.push(programsFilter); }
				if(softwareComponentsFilter) { filters.push(softwareComponentsFilter); }

				return filters.map(function(filter) { return "(" + filter + ")"; }).join(" and ");
			}).join(" or ");
		}

		return function(sAppId) {
			var that = this;
			var config = configService.getConfigForAppId(sAppId);
			config.initialize();

			this.summary = {};
			this.details = [];

			this.loadSummary = function() {
				var deferred = $q.defer();

				$q.all({
					prio1: $http.get("https://sithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '1' and " + getQueryString(config)),
					prio2: $http.get("https://sithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/Items/$count?$filter=CM_PRIORITY eq '2' and " + getQueryString(config))
				}).then(function(result) {
					that.summary.prio1 = parseInt(result.prio1.data);
					that.summary.prio2 = parseInt(result.prio2.data);
					deferred.resolve();
				}, function() {
					deferred.reject();
				});

				return deferred.promise;
			};

			this.loadDetails = function() {
				var deferred = $q.defer();

				this.details.length = 0;

				$q.all({
					prio1: $http.get("https://sithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/Items?$filter=CM_PRIORITY eq '1' and " + getQueryString(config)),
					prio2: $http.get("https://sithdb.wdf.sap.corp/oprr/cwbr/reporting/bridge/Notes.xsodata/Items?$filter=CM_PRIORITY eq '2' and " + getQueryString(config))
				}).then(function(result) {
					Array.prototype.push.apply(that.details, result.prio1.data.d.results);
					Array.prototype.push.apply(that.details, result.prio2.data.d.results);
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
