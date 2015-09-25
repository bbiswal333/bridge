angular.module("app.cats.dataModule", ["lib.utils"])
.service("app.cats.cat2BackendZDEVDB", ["$http", "$q", "$log", "$window", "lib.utils.calUtils", "app.cats.catsUtils",
	function($http, $q, $log, $window, calUtils, catsUtils) {
		var MYCATSDATA_WEBSERVICE      = 'https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA?format=json&origin=' + $window.location.origin + "&options=SHORT";
		var GETWORKLIST_WEBSERVICE     = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETWORKLIST?format=json&origin=" + $window.location.origin + "&begda=20101001&endda=20151001";
		//var GETWORKLIST_IFP_WEBSERVICE = "https://ifp.wdf.sap.corp/sap/bc/bridge/GET_CPRO_WORKLIST?format=json&origin=" + $window.location.origin;
		var GETTASKTEXT_IFP_WEBSERVICE = "https://ifp.wdf.sap.corp/sap/bc/bridge/GET_CPRO_INFORMATION?format=json&origin=" + $window.location.origin;
		var GETCATSDATA_WEBSERVICE     = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=" + $window.location.origin + "&week=";
		var WRITECATSDATA_WEBSERVICE   = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA?format=json&origin=" + $window.location.origin;
		var TASKTYPE_F4HELP_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETF4DATA?format=json&origin=" + $window.location.origin;
		var ORDER_F4HELP_WEBSERVICE    = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCOSTOBJ?format=json&origin=" + $window.location.origin + "&options=OR";

		this.CAT2ComplinaceDataCache = [];
		this.CAT2ComplinaceDataPromise = {};
		this.CPROTaskTextCache = {};
		this.CPROTaskTextCache.DATA = [];
		this.CAT2AllocationDataForWeeks = {};

		var catsProfileFromBackendPromise;
		this.catsProfile = "";
		this.gracePeriodInMonth = 0;
		this.futureGracePeriodInDays = 0;
		var tasksFromWorklistPromise;
		var tasktypesPromise;
		var that = this;

		function _httpGetRequest(url) {
			var deferred = $q.defer();

			$http.get(url, {
				timeout: 30000
			}).success(function(data, status) {
				deferred.resolve(data, status);
			}).error(function(data, status) {
				$log.log("GET-Request to " + url + " failed. HTTP-Status: " + status);
				deferred.reject("Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.");
			});

			return deferred.promise;
		}

		function monthAlreadyCached(year, month) {
			var middate = "" + year + "-" + calUtils.toNumberOfCharactersString(month + 1, 2) + "-" + "15";
			if (_.find(that.CAT2ComplinaceDataCache, {
					"DATEFROM": middate
				}) !== undefined) {
				return true;
			} else {
				return false;
			}
		}

		this.getTaskDescription = function(container) {
			var deferred = $q.defer();
			if (container === undefined ||
				container.DATA === undefined) {
				deferred.resolve();
				return deferred.promise;
			}

			if (this.CPROTaskTextCache.DATA) {
				var newItemFound = false;
				for (var i = 0; i < container.DATA.length; i++) {
					var bufferedItem = _.find(this.CPROTaskTextCache.DATA, {
						"TASK_ID": container.DATA[i].TASK_ID
					});
					if (!bufferedItem) {
						newItemFound = true;
					}
				}
				if (!newItemFound) {
					deferred.resolve(this.CPROTaskTextCache);
					return deferred.promise;
				}
			}

			$http.post(GETTASKTEXT_IFP_WEBSERVICE, container, {
				'headers': {
					'Content-Type': 'text/plain'
				}
			}).success(function(data) {
				for (var j = 0; j < data.DATA.length; j++) {
					that.CPROTaskTextCache.DATA.push(data.DATA[j]);
				}
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject(status);
			});

			return deferred.promise;
		};

		this.updateDescriptionsFromCPRO = function(items) {
			var deferred = $q.defer();

			var container = {};
			container.DATA = [];
			for (var i = 0; i < items.length; i++) {
				if (items[i].ZCPR_OBJGEXTID !== "" &&
					(items[i].DESCR === items[i].ZCPR_OBJGEXTID ||
						items[i].DESCR === "")) {
					container.DATA.push({
						TASK_ID: items[i].ZCPR_OBJGEXTID
					});
				}
			}

			this.getTaskDescription(container)
			.then(function(data) {
				if (data) {
					for (var j = 0; j < data.DATA.length; j++) {
						for (var k = 0; k < items.length; k++) {
							if (items[k].ZCPR_OBJGEXTID === data.DATA[j].TASK_ID) {
								items[k].DESCR = data.DATA[j].TEXT;
							}
						}
					}
				}
				deferred.resolve(items);
			}, deferred.reject);
			return deferred.promise;
		};

		this.determineCatsProfileFromBackend = function() {
			var deferred = $q.defer();

			if (catsProfileFromBackendPromise) {
				return catsProfileFromBackendPromise;
			} else {
				catsProfileFromBackendPromise = deferred.promise;

				var today = new Date();
				var todayString = "" + today.getFullYear() + calUtils.toNumberOfCharactersString(today.getMonth() + 1, 2) + calUtils.toNumberOfCharactersString(today.getDate(), 2);

				_httpGetRequest(MYCATSDATA_WEBSERVICE + "PROFILEONLYGRACEPERIOD&begda=" + todayString + "&endda=" + todayString)
				.then(function(data) {
					// try to get it from ISP configuration
					if ( !data ) {
						deferred.reject();
						return;
					}
					if (data.G_PERIOD) {
						this.gracePeriodInMonth = data.G_PERIOD * 1;
					}
					if (data.F_G_PERIOD) {
						this.futureGracePeriodInDays = data.F_G_PERIOD * 1;
					}
					if (data.PROFILE) {
						data.PROFILE = data.PROFILE.toUpperCase();
					}
					if (data.PROFILE &&
					   (data.PROFILE.indexOf("DEV2002") > -1 ||
						data.PROFILE.indexOf("DEV2012") > -1 ||
						data.PROFILE.indexOf("SUP2007") > -1 ||
						data.PROFILE.indexOf("IN") > -1 ||
						data.PROFILE.indexOf("AUSALE") > -1)) {

						$log.log("Time recording profile retrieved from Backend: " + data.PROFILE);
						that.catsProfile = data.PROFILE;
						deferred.resolve(data.PROFILE);

					} else {
						var promises = [];
						var week = calUtils.getWeekNumber(today);
						// it is all about the template, try to detect most common profiles
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "DEV2002C"));
						var profileDEV2002C = 0;
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "SUP2007D"));
						var profileSUP2007D = 1;
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "SUP2007C"));
						var profileSUP2007C = 2;
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "SUP2007H"));
						var profileSUP2007H = 3;
						var promise = $q.all(promises);
						promise
						.then(function(promisesData) {
							var dataForAnalysis = [];

							angular.forEach(promisesData, function(oData) {

								oData.entriesWhichAreNotFixedTasks = 0;
								oData.entriesWithSubtype = 0;

								for (var i = 0; i < oData.CATS_EXT.length; i++) {
									if (!catsUtils.isFixedTask(oData.CATS_EXT[i])) {
										oData.entriesWhichAreNotFixedTasks += 1;
										var entry = _.find(oData.CATS_EXT_TASK, {
											"RAUFNR": oData.CATS_EXT[i].RAUFNR,
											"TASKTYPE": oData.CATS_EXT[i].TASKTYPE,
											"ZZSUBTYPE": oData.CATS_EXT[i].ZZSUBTYPE,
											"ZCPR_OBJGEXTID": oData.CATS_EXT[i].ZCPR_OBJGEXTID
										});
										// make corrections if tasks are already posted presumingly for a different profile
										if (entry) {
											if (oData.catsProfile === "DEV2002C") {
												if (oData.CATS_EXT[i].ZZSUBTYPE) {
													oData.entriesWhichAreNotFixedTasks -= 1; // Well this shall not be considered for this CAT2 profile
												}
											} else {
												if (!oData.CATS_EXT[i].ZZSUBTYPE) {
													oData.entriesWhichAreNotFixedTasks -= 1; // Well this shall not be considered for this CAT2 profile
												}
											}
										}
										if (oData.CATS_EXT[i].ZZSUBTYPE) {
											oData.entriesWithSubtype += 1;
										}
									}
								}
								dataForAnalysis.push(oData);
							});

							var profileToUse = "DEV2002C";
							if (		dataForAnalysis[profileDEV2002C].entriesWhichAreNotFixedTasks >= dataForAnalysis[profileSUP2007D].entriesWhichAreNotFixedTasks &&
										dataForAnalysis[profileDEV2002C].entriesWhichAreNotFixedTasks >= dataForAnalysis[profileSUP2007H].entriesWhichAreNotFixedTasks &&
										dataForAnalysis[profileDEV2002C].entriesWhichAreNotFixedTasks >= dataForAnalysis[profileSUP2007C].entriesWhichAreNotFixedTasks) {
								profileToUse = "DEV2002C";
							} else if (	dataForAnalysis[profileSUP2007D].entriesWhichAreNotFixedTasks >= dataForAnalysis[profileSUP2007H].entriesWhichAreNotFixedTasks &&
										dataForAnalysis[profileSUP2007D].entriesWhichAreNotFixedTasks >= dataForAnalysis[profileSUP2007C].entriesWhichAreNotFixedTasks &&
										dataForAnalysis[profileSUP2007D].entriesWithSubtype > 0) {
								profileToUse = "SUP2007D";
							} else if (	dataForAnalysis[profileSUP2007H].entriesWhichAreNotFixedTasks >= dataForAnalysis[profileSUP2007C].entriesWhichAreNotFixedTasks &&
										dataForAnalysis[profileSUP2007H].entriesWithSubtype > 0) {
								profileToUse = "SUP2007H";
							} else if (	dataForAnalysis[profileSUP2007C].entriesWithSubtype > 0) {
								profileToUse = "SUP2007C";
							}

							$log.log("Time recording profile " + profileToUse + " determined.");
							that.catsProfile = profileToUse;
							deferred.resolve(profileToUse);

						}, deferred.reject);
					}
				}, deferred.reject);
			}
			return deferred.promise;

		};

		function getCAT2ComplianceData(date) {
			var deferred = $q.defer();
			var dateString = "" + date.getFullYear() + calUtils.toNumberOfCharactersString(date.getMonth() + 1, 2) + calUtils.toNumberOfCharactersString(date.getDate(), 2);

			_httpGetRequest(MYCATSDATA_WEBSERVICE + "&begda=" + dateString + "&endda=" + dateString)
			.then(function(data) {
				if (data && data.CATSCHK) {
					angular.forEach(data.CATSCHK, function(CATSCHKforDay) {
						var entry = _.find(that.CAT2ComplinaceDataCache, {
							"DATEFROM": CATSCHKforDay.DATEFROM
						});
						if (entry !== undefined) {
							var index = that.CAT2ComplinaceDataCache.indexOf(entry);
							if (index > -1) {
								that.CAT2ComplinaceDataCache.splice(index, 1);
							}
						}
						// ////////////////////////////////////////////////////////
						// // test test test: uncomment to be colleague with Su-Th work week
						// if (CATSCHKforDay.DATEFROM === "2015-08-07" ||
						// 	CATSCHKforDay.DATEFROM === "2015-08-14" ||
						// 	CATSCHKforDay.DATEFROM === "2015-08-21" ||
						// 	CATSCHKforDay.DATEFROM === "2015-08-28") {
						// 	CATSCHKforDay.STDAZ = 0;
						// 	CATSCHKforDay.STATUS = "N"; // maintenance not required
						// }
						// if (CATSCHKforDay.DATEFROM === "2015-08-02" ||
						// 	CATSCHKforDay.DATEFROM === "2015-08-09" ||
						// 	CATSCHKforDay.DATEFROM === "2015-08-16" ||
						// 	CATSCHKforDay.DATEFROM === "2015-08-23" ||
						// 	CATSCHKforDay.DATEFROM === "2015-08-30") {
						// 	CATSCHKforDay.STDAZ = 8;
						// 	CATSCHKforDay.STATUS = "R"; // not yet maintained
						// }
						// ////////////////////////////////////////////////////////
						// // test test test: uncomment to be a part-time colleague
						// CATSCHKforDay.CONVERT_H_T = 7.9;
						// if (CATSCHKforDay.STDAZ) {
						// 	CATSCHKforDay.STDAZ = 7.55;
						// 	var QUANTITYHRounded = Math.round(CATSCHKforDay.QUANTITYH * 100) / 100;
						// 	var STADZRounded = Math.round(CATSCHKforDay.STDAZ * 8 / CATSCHKforDay.CONVERT_H_T * 100) / 100;
						// 	if (STADZRounded && QUANTITYHRounded) {
						// 		if (STADZRounded === QUANTITYHRounded) {
						// 			CATSCHKforDay.STATUS = "G"; // maintained
						// 		} else {
						// 			CATSCHKforDay.STATUS = "Y"; // part time or overbooked
						// 		}
						// 	}
						// }
						// ////////////////////////////////////////////////////////
						that.CAT2ComplinaceDataCache.push(CATSCHKforDay);
					});
					deferred.resolve(data.CATSCHK);
				}
				deferred.reject();
			}, deferred.reject);
			return deferred.promise;
		}

		function getCAT2ComplianceForRange(deferred, begDate, endDate) {
			var promises = [];
			var date = begDate;

			for (var week = 0; date <= endDate; week++) {
				promises.push(getCAT2ComplianceData(date));
				date.setDate(date.getDate() + 7);
			}
			var promise = $q.all(promises);
			promise.then(function(aPromises) {
				angular.forEach(aPromises, function(promiseData) {
					if (!promiseData || promiseData.length !== 7) { // days a week
						deferred.reject();
						return;
					}
				});
				deferred.resolve(that.CAT2ComplinaceDataCache);
			});
		}

		this.getCAT2ComplianceData4OneMonth = function(year, month, forceUpdate_b) {
			var deferred = $q.defer();

			this.determineCatsProfileFromBackend()
			.then(function() { }, function() { deferred.reject(); }); // trigger profile determination

			if (forceUpdate_b || !monthAlreadyCached(year, month)) {
				var begDate = new Date(year,month,1,12);
				// begDate shall be Monday
				if (begDate.getDay() === 0) { // Sunday
					begDate.setDate(begDate.getDate() - 6);
				} else {
					begDate.setDate(begDate.getDate() + 1 - begDate.getDay());
				}
				var endDate = new Date(year,month,calUtils.getLengthOfMonth(year, month),12);
				getCAT2ComplianceForRange(deferred, begDate, endDate);
			} else {
				deferred.resolve(that.CAT2ComplinaceDataCache);
			}
			that.CAT2ComplinaceDataPromise = deferred.promise;
			return deferred.promise;
		};

		// this.getMissingDays = function() {
		// 	var deferred = $q.defer();

		// 	var begDate = new Date(year,month,1,12);
		// 	// begDate shall be Monday
		// 	if (begDate.getDay() === 0) { // Sunday
		// 		begDate.setDate(begDate.getDate() - 6);
		// 	} else {
		// 		begDate.setDate(begDate.getDate() + 1 - begDate.getDay());
		// 	}
		// 	var endDate = new Date(year,month,calUtils.getLengthOfMonth(year, month),12);
		// 	getCAT2ComplianceForRange(deferred, begDate, endDate);

		// 	return deferred.promise;
		// };


		function processCatsAllocationDataForWeek(year, week, deferred, data, status, catsProfile) {
			week = calUtils.toNumberOfCharactersString(week, 2);
			if (!data) {
				deferred.reject(status);
			} else if (data.TIMESHEETS.WEEK !== week + "." + year) {
				$log.log("getCatsAllocationDataForWeek() data does not correspond to given week and year.");
				deferred.resolve();
			} else {
				data.catsProfile = catsProfile;
				if (data && data.TIMESHEETS && data.TIMESHEETS.RECORDS && data.TIMESHEETS.RECORDS.length > 0) {
					if(data.CATS_EXT.length === data.TIMESHEETS.RECORDS.length) {
						for (var j = 0; j < data.TIMESHEETS.RECORDS.length; j++) {
							data.TIMESHEETS.RECORDS[j].ZZSUBTYPE = data.CATS_EXT[j].ZZSUBTYPE;
							data.TIMESHEETS.RECORDS[j].RNPLNR = data.CATS_EXT[j].RNPLNR;
							data.TIMESHEETS.RECORDS[j].VORNR = data.CATS_EXT[j].VORNR;
							data.TIMESHEETS.RECORDS[j].AUTYP = data.CATS_EXT[j].AUTYP;
							data.TIMESHEETS.RECORDS[j].TASKLEVEL = data.CATS_EXT[j].TASKLEVEL;
							data.TIMESHEETS.RECORDS[j].SKOSTL = data.CATS_EXT[j].SKOSTL;
							data.TIMESHEETS.RECORDS[j].ZZOBJNR = data.CATS_EXT[j].ZZOBJNR;
							if (data.TIMESHEETS.RECORDS[j].DESCR === "" && data.CATS_EXT[j].LTXA1 !== "") {
								data.TIMESHEETS.RECORDS[j].DESCR = data.CATS_EXT[j].LTXA1;
							}
							if(data.CATS_EXT_TASK && data.TIMESHEETS.RECORDS[j].DAYS) {
								/* eslint-disable no-loop-func */
								angular.forEach(data.TIMESHEETS.RECORDS[j].DAYS, function(task) {
								/* eslint-enable no-loop-func */
									var entry = _.find(data.CATS_EXT_TASK, { "COUNTER": task.COUNTER });
									if(entry) {
										task.TASKCOUNTER = entry.TASKCOUNTER;
									}
								});
							}
						}
					}
					that.updateDescriptionsFromCPRO(data.TIMESHEETS.RECORDS)
					.then(function(items) {
						data.TIMESHEETS.RECORDS = items;
						deferred.resolve(data);
					}, deferred.reject);
				} else {
					deferred.resolve(data);
				}
			}
		}

		function retrieveCatsAllocationDataForWeek(deferred, year, week, catsProfile) {
			_httpGetRequest(GETCATSDATA_WEBSERVICE + year + "." + week + "&options=CLEANMINIFYSHORTNOTARGETHOURSDESCRDETAILS&catsprofile=" + catsProfile)
			.then(function(data, status) {
				processCatsAllocationDataForWeek(year, week, deferred, data, status, catsProfile);
			}, deferred.reject);
		}

		this.getCatsAllocationDataForWeek = function(year, week, catsProfile) {
			var deferred = $q.defer();
			week = calUtils.toNumberOfCharactersString(week, 2);
			if (catsProfile) {
				retrieveCatsAllocationDataForWeek(deferred, year, week, catsProfile);
			} else {
				this.determineCatsProfileFromBackend()
				.then(function(catsProfileFromBackend) {
					retrieveCatsAllocationDataForWeek(deferred, year, week, catsProfileFromBackend);
				}, deferred.reject);
				if (that.catsProfile) { // cache only if profile is already clear
					that.CAT2AllocationDataForWeeks[year + "" + week] = deferred.promise;
				}
			}
			return deferred.promise;
		};

		this.requestTasksFromTemplate = function(year, week, forceUpdate_b) {
			var deferred = $q.defer();

			// this here is important for the app settings
			if (forceUpdate_b || !this.CAT2AllocationDataForWeeks[year + "" + week]) {
				this.getCatsAllocationDataForWeek(year, week);
			}

			var promise = $q.all(this.CAT2AllocationDataForWeeks);
			promise
			.then(function(promisesData) {
				var tasks = [];
				angular.forEach(promisesData, function(data) {

					if (that.catsProfile.indexOf("DEV20") > -1 ||
						that.catsProfile.indexOf("INFR") > -1) {
						tasks.push({
							RAUFNR: "",
							TASKTYPE: "ADMI",
							RNPLNR: "",
							VORNR: "",
							AUTYP: "",
							TASKLEVEL: "",
							SKOSTL: "",
							ZZOBJNR: "",
							ZCPR_EXTID: "",
							ZCPR_OBJGEXTID: "",
							ZZSUBTYPE: "",
							DESCR: "Administrative"
						});
						tasks.push({
							RAUFNR: "",
							TASKTYPE: "EDUC",
							RNPLNR: "",
							VORNR: "",
							AUTYP: "",
							TASKLEVEL: "",
							SKOSTL: "",
							ZZOBJNR: "",
							ZCPR_EXTID: "",
							ZCPR_OBJGEXTID: "",
							ZZSUBTYPE: "",
							DESCR: "Personal education"
						});
					}

					if (data && data.TIMESHEETS && data.TIMESHEETS.RECORDS) {
						var nodes = data.TIMESHEETS.RECORDS;
						for (var i = 0; i < nodes.length; i++) {
							var task = {};
							task.RAUFNR = (nodes[i].RAUFNR || "");
							task.TASKTYPE = (nodes[i].TASKTYPE || "");
							task.RNPLNR = (nodes[i].RNPLNR || "");
							task.VORNR = (nodes[i].VORNR || "");
							task.AUTYP = (nodes[i].AUTYP || "");
							task.TASKLEVEL = (nodes[i].TASKLEVEL || "");
							task.SKOSTL = (nodes[i].SKOSTL || "");
							task.ZZOBJNR = (nodes[i].ZZOBJNR || "");
							task.ZCPR_EXTID = (nodes[i].ZCPR_EXTID || "");
							task.ZCPR_OBJGEXTID = (nodes[i].ZCPR_OBJGEXTID || "");
							task.ZZSUBTYPE = (nodes[i].ZZSUBTYPE || "");
							task.UNIT = nodes[i].UNIT;
							task.DESCR = nodes[i].DESCR || nodes[i].DISPTEXTW2;
							tasks.push(task);
						}
					}
				}, deferred.reject);
				deferred.resolve(tasks);
			}, deferred.reject);
			return deferred.promise;
		};

		this.requestTasksFromWorklist = function() {
			// _httpGetRequest(GETWORKLIST_IFP_WEBSERVICE + "&objtype=TTO").then(function(data, status) {
			//   if (!data) {
			//	 status = status;
			//   } else {
			//	 data = data;
			//   }
			// });
			var deferred = $q.defer();
			this.determineCatsProfileFromBackend()
			.then(function(catsProfile) {
				if (catsProfile !== "DEV2002C" &&
				    catsProfile !== "DEV2002H" &&
				    catsProfile !== "DEV2012C") { // These are the only profiles where the cPro worklist shall be read
					deferred.resolve();
				} else {
					if (!tasksFromWorklistPromise) {
						tasksFromWorklistPromise = _httpGetRequest(GETWORKLIST_WEBSERVICE + "&catsprofile=" + catsProfile);
					}
					tasksFromWorklistPromise
					.then(function(data) {
						var tasks = [];

						if (data && data.WORKLIST) {
							var nodes = data.WORKLIST;
							for (var i = 0; i < nodes.length; i++) {
								var task = {};
								task.RAUFNR = (nodes[i].RAUFNR || "");
								task.TASKTYPE = (nodes[i].TASKTYPE || "");
								task.ZCPR_EXTID = (nodes[i].ZCPR_EXTID || "");
								task.ZCPR_OBJGEXTID = (nodes[i].ZCPR_OBJGEXTID || "");
								task.ZZSUBTYPE = (nodes[i].ZZSUBTYPE || "");
								if (catsUtils.isHourlyProfil(catsProfile)) {
									task.UNIT = nodes[i].UNIT || "H";
								} else {
									task.UNIT = nodes[i].UNIT || "T";
								}
								task.projectDesc = nodes[i].DISPTEXTW1;
								task.DESCR = nodes[i].DESCR || nodes[i].DISPTEXTW2;
								tasks.push(task);
							}
						}

						deferred.resolve(tasks);
					}, deferred.reject);
				}
			}, deferred.reject);
			return deferred.promise;
		};

		this.requestTasktypes = function() {
			var deferred = $q.defer();
			this.determineCatsProfileFromBackend()
			.then(function(catsProfile) {
				if (!tasktypesPromise) {
					tasktypesPromise = _httpGetRequest(TASKTYPE_F4HELP_WEBSERVICE + "&catsprofile=" + catsProfile);
				}
				tasktypesPromise
				.then(function(data) {
					deferred.resolve(data);
				}, deferred.reject);
			}, deferred.reject);
			return deferred.promise;
		};

		this.requestOrders = function(searchExpression) {
			return _httpGetRequest(ORDER_F4HELP_WEBSERVICE + searchExpression);
		};

		this.writeCATSData = function(container) {
			var deferred = $q.defer();

			this.determineCatsProfileFromBackend().then(function(catsProfile) {
				$http.post(WRITECATSDATA_WEBSERVICE + "&OPTIONS=CATSHOURS&DATAFORMAT=CATSDB&catsprofile=" + catsProfile, container, {
					'timeout': 60000,
					'headers': {
						'Content-Type': 'text/plain'
					}
				}).success(function(data) {
					deferred.resolve(data);
				}).error(function(data, status) {
					$log.log("POST-Request to " + WRITECATSDATA_WEBSERVICE + "&OPTIONS=CATSHOURS&DATAFORMAT=CATSDB&catsprofile=" + catsProfile + " failed. HTTP-Status: " + status);
					deferred.reject("Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.");
				});
			});
			return deferred.promise;
		};
	}
]);
