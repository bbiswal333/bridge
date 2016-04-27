angular.module('app.programMilestones').service("app.programMilestones.dataFactory", ["app.programMilestones.configFactory", "app.programMilestones.milestoneFactory", "$http", "$q", function(configFactory, milestoneFactory, $http, $q) {
	var Data = (function() {
		return function(sAppId) {
			var milestones = [];
			var config = configFactory.getConfigForAppId(sAppId);

			function loadMilestones() {
				var deferred = $q.defer();
				var loadedMilestones = [];
				$q.all(config.getPrograms().map(function(program) {
					if(program.isSiriusProgram()) {
						return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_PRS_PROGRAM_MILESTONES?programGUID=" + program.getGUID()).then(function(response) {
							response.data.PHASES.map(function(rawMilestone) {
								if(rawMilestone.MILESTONE_DATE !== "0000-00-00") {
									var milestone = milestoneFactory.createInstance(rawMilestone.MILESTONE_NAME, rawMilestone.MILESTONE_DATE, rawMilestone.MILESTONE_TIME, program, rawMilestone.DELIVERY_NAME, rawMilestone.MILESTONE_TYPE, rawMilestone.MILESTONE_TYPE_TXT);
									program.setName(rawMilestone.PROGRAM_NAME);
									if(milestone.isUpcoming() && config.isMilestoneTypeActive(rawMilestone.MILESTONE_TYPE)) {
										loadedMilestones.push(milestone);
									}
								}
							});
						});
					} else {
						return $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_PR_PROGRAM_MILESTONES?programGUID=" + program.getGUID()).then(function(response) {
							response.data.PHASES.map(function(rawMilestone) {
								if(rawMilestone.PHASE_START_DATE !== "0000-00-00") {
									var milestone = milestoneFactory.createInstance(rawMilestone.PHASE_TXT, rawMilestone.PHASE_START_DATE, rawMilestone.PHASE_START_TIME, program, undefined, rawMilestone.PHASE_TYPE_ID, rawMilestone.PHASE_TYPE_TXT);
									if(milestone.isUpcoming() && config.isMilestoneTypeActive(rawMilestone.PHASE_TYPE_ID)) {
										loadedMilestones.push(milestone);
									}
								}
							});
						});
					}
				})).then(function(){
					milestones.length = 0;
					loadedMilestones.map(function(milestone) { milestones.push(milestone); });
					deferred.resolve();
				});
				return deferred.promise;
			}

			function sortMilestones(a, b) {
				if(a.getDate() > b.getDate()) {
					return 1;
				} else if(a.getDate() < b.getDate()) {
					return -1;
				} else {
					return 0;
				}
			}

			this.getMilestones = function() {
				return milestones.sort(sortMilestones);
			};

			this.refreshMilestones = function() {
				return loadMilestones();
			};
		};
	})();

	var dataObjects = {};

	this.getDataForAppId = function(sAppId) {
		if(!dataObjects[sAppId]) {
			dataObjects[sAppId] = new Data(sAppId);
		}
		return dataObjects[sAppId];
	};
}]);
