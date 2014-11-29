angular.module("app.cats.dataModule", ["lib.utils"])
.service("app.cats.cat2BackendZDEVDB", ["$http", "$q", "$log", "$window", "lib.utils.calUtils",
	function($http, $q, $log, $window, calUtils) {
		var MYCATSDATA_WEBSERVICE = 'https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA?format=json&origin=' + $window.location.origin + "&options=SHORT";
		var GETWORKLIST_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETWORKLIST?format=json&origin=" + $window.location.origin + "&begda=20101001&endda=20151001";
		//var GETWORKLIST_IFP_WEBSERVICE = "https://ifp.wdf.sap.corp/sap/bc/bridge/GET_CPRO_WORKLIST?format=json&origin="	+ $window.location.origin;
		var GETTASKTEXT_IFP_WEBSERVICE = "https://ifp.wdf.sap.corp/sap/bc/bridge/GET_CPRO_INFORMATION?format=json&origin=" + $window.location.origin;
		var GETCATSDATA_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=" + $window.location.origin + "&week=";
		var WRITECATSDATA_WEBSERVICE = "https://isp.wdf.sap.corp:443/sap/bc/zdevdb/WRITECATSDATA?origin=" + $window.location.origin;

		this.CAT2ComplinaceDataCache = [];
		this.CPROTaskTextCache = {};
		this.CPROTaskTextCache.DATA = [];
		this.CAT2AllocationDataForWeeks = {};

		var catsProfileFromBackendPromise;
		this.catsProfile = "";
		var tasksFromWorklistPromise;
		var that = this;

		function _httpGetRequest(url) {
			var deferred = $q.defer();

			$http.get(url, {
				timeout: 25000
			}).success(function(data, status) {
				deferred.resolve(data, status);
			}).error(function(data, status) {
				$log.log("GET-Request to " + url + " failed. HTTP-Status: " + status);
				deferred.reject(status);
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
				var todayString = "" + today.getFullYear() + calUtils.toNumberOfCharactersString(today.getMonth() + 1, 2) + today.getDate();
				var twoMonthAgo = new Date();
				twoMonthAgo.setDate(twoMonthAgo.getDate() - 60);
				_httpGetRequest(MYCATSDATA_WEBSERVICE + "PROFILEONLY&begda=" + todayString + "&endda=" + todayString)
				.then(function(data) {
					// try to get it from ISP configuration
					if ( !data ) {
						deferred.reject();
					}
					if (data.PROFILE) {
						data.PROFILE = data.PROFILE.toUpperCase();
					}
					if (data.PROFILE) {
						if (data.PROFILE.indexOf("DEV2002C") > -1 ||
						 	data.PROFILE.indexOf("SUP2007C") > -1 ||
							data.PROFILE.indexOf("SUP2007D") > -1) {
							$log.log(data.PROFILE);
							that.catsProfile = data.PROFILE;
							deferred.resolve(data.PROFILE);
						} else if ( data.PROFILE.indexOf("DEV2002") > -1 ||
						 			data.PROFILE.indexOf("SUP2012") > -1 ||
									data.PROFILE.indexOf("SUP2007") > -1 ||
									data.PROFILE.indexOf("AUSALE") > -1) {
							$log.log("CATS2 profile not supported");
							that.catsProfile = "CAT2_PROFILE_NOT_SUPPORTED";
							deferred.reject("CAT2_PROFILE_NOT_SUPPORTED");
						}
					} else {
						// Now read templates in different profiles
						var promises = [];
						var week = calUtils.getWeekNumber(today);
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "DEV2002C"));
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "SUP2007D"));
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "SUP2007C"));
						week = calUtils.getWeekNumber(twoMonthAgo);
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "DEV2002C"));
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "SUP2007D"));
						promises.push(that.getCatsAllocationDataForWeek(week.year, week.weekNo, "SUP2007C"));
						var promise = $q.all(promises);
						promise
						.then(function(promisesData) {
							var dataForAnalysis = [];

							// find any subtype?
							var entriesWithSubtype = 0;
							var totalEntries = 0;
							var catsxtTaskFound = false;
							angular.forEach(promisesData, function(data) {
								for (var i = 0; i < data.CATS_EXT.length; i++) {
									totalEntries += 1;
									if (data.CATS_EXT[i].ZZSUBTYPE) {
										entriesWithSubtype += 1;
									}
									if (!data.CATS_EXT[i].TASKTYPE &&
										!data.CATS_EXT[i].RAUFNR &&
										!data.CATS_EXT[i].ZCPR_EXTID) {
										catsxtTaskFound = true;
									}
								}
								dataForAnalysis.push(data);
							});
							if (catsxtTaskFound) {
								$log.log("CATSXT is not supported");
								that.catsProfile = "CATSXT_NOT_SUPPORTED";
								deferred.reject("CATSXT_NOT_SUPPORTED");
							} else if (entriesWithSubtype > 0 && (totalEntries / entriesWithSubtype) <= 2) {
								if (dataForAnalysis[1].CATS_EXT.length >= dataForAnalysis[2].CATS_EXT.length) {
									$log.log("SUP2007D " + totalEntries + " " + entriesWithSubtype);
									that.catsProfile = "SUP2007D";
									deferred.resolve("SUP2007D");
								} else {
									$log.log("SUP2007C " + totalEntries + " " + entriesWithSubtype);
									that.catsProfile = "SUP2007C";
									deferred.resolve("SUP2007C");
								}
							} else if (entriesWithSubtype === 0 && totalEntries > 0) {
								$log.log("DEV2002C " + totalEntries + " " + entriesWithSubtype);
								that.catsProfile = "DEV2002C";
								deferred.resolve("DEV2002C");
							} else {
								$log.log("CATS2 profile not determined");
								that.catsProfile = "CAT2_PROFILE_UNKNOWN";
								deferred.reject("CAT2_PROFILE_UNKNOWN");
							}
						}, deferred.reject);
					}
				}, deferred.reject);
			}
			return deferred.promise;

		};

		function getCAT2ComplianceData(date) {
			var deferred = $q.defer();
			date = "" + date.getFullYear() + calUtils.toNumberOfCharactersString(date.getMonth() + 1, 2) + calUtils.toNumberOfCharactersString(date.getDate(), 2);

			_httpGetRequest(MYCATSDATA_WEBSERVICE + "&begda=" + date + "&endda=" + date)
			.then(function(data) { // Amelie Amelie
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
						// // test test test: uncomment to be a part-time colleague
						// CATSCHKforDay.CONVERT_H_T = 7.9;
						// if (CATSCHKforDay.STDAZ) {
						//   CATSCHKforDay.STDAZ = 7.55;
						//   var QUANTITYHRounded = Math.round(CATSCHKforDay.QUANTITYH * 100) / 100;
						//   var STADZRounded = Math.round(CATSCHKforDay.STDAZ * 8 / CATSCHKforDay.CONVERT_H_T * 100) / 100;
						//   if (STADZRounded && QUANTITYHRounded) {
						//	 if (STADZRounded === QUANTITYHRounded) {
						//	   CATSCHKforDay.STATUS = "G"; // maintained
						//	 } else {
						//	   CATSCHKforDay.STATUS = "Y"; // part time or overbooked
						//	 }
						//   }
						// }
						// ////////////////////////////////////////////////////////
						that.CAT2ComplinaceDataCache.push(CATSCHKforDay);
					});
				}
				deferred.resolve();
			}, deferred.reject);
			return deferred.promise;
		}

		function getCAT2ComplianceForRange(deferred, begdate, enddate) {
			var promises = [];
			var date = new Date(begdate.substr(0,4),begdate.substr(4,2) - 1,begdate.substr(6,2),12);
			enddate = new Date(enddate.substr(0,4),enddate.substr(4,2) - 1,enddate.substr(6,2),12);

			for (var week = 0; date < enddate; week++) {
				promises.push(getCAT2ComplianceData(date));
				date.setDate(date.getDate() + 7);
			}
			var promise = $q.all(promises);
			promise.then(function() {
				deferred.resolve(that.CAT2ComplinaceDataCache);
			});
		}

		this.getCAT2ComplianceData4OneMonth = function(year, month, forceUpdate_b) {
			var deferred = $q.defer();

			this.determineCatsProfileFromBackend(); // trigger profile determination

			if (forceUpdate_b || !monthAlreadyCached(year, month)) {
				var begdate = "" + year + calUtils.toNumberOfCharactersString(month + 1, 2) + "01";
				var enddate = "" + year + calUtils.toNumberOfCharactersString(month + 1, 2) + calUtils.getLengthOfMonth(year, month);
				getCAT2ComplianceForRange(deferred, begdate, enddate);
			} else {
				deferred.resolve(that.CAT2ComplinaceDataCache);
			}
			return deferred.promise;
		};

		function processCatsAllocationDataForWeek(year, week, deferred, data, status) {
			week = calUtils.toNumberOfCharactersString(week, 2);
			if (!data) {
				deferred.reject(status);
			} else if (data.TIMESHEETS.WEEK !== week + "." + year) {
				$log.log("getCatsAllocationDataForWeek() data does not correspond to given week and year.");
				deferred.resolve();
			} else {
				if (data && data.TIMESHEETS && data.TIMESHEETS.RECORDS && data.TIMESHEETS.RECORDS.length > 0) {
					if(data.CATS_EXT.length === data.TIMESHEETS.RECORDS.length) {
						for (var j = 0; j < data.CATS_EXT.length; j++) {
							data.TIMESHEETS.RECORDS[j].ZZSUBTYPE = data.CATS_EXT[j].ZZSUBTYPE;
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
			_httpGetRequest(GETCATSDATA_WEBSERVICE + year + "." + week + "&options=CLEANMINIFYSHORTNOTARGETHOURS&catsprofile=" + catsProfile)
			.then(function(data, status) {
				processCatsAllocationDataForWeek(year, week, deferred, data, status);
			}, deferred.reject);
			that.CAT2AllocationDataForWeeks[catsProfile + "" + year + "" + week] = deferred.promise;
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
			}
			return deferred.promise;
		};

		this.requestTasksFromTemplate = function(year, week, forceUpdate_b) {
			var deferred = $q.defer();

			// this here is important for the app settings
			if (forceUpdate_b || !this.CAT2AllocationDataForWeeks[this.catsProfile + "" + year + "" + week]) {
				this.getCatsAllocationDataForWeek(year, week);
			}

			var promise = $q.all(this.CAT2AllocationDataForWeeks);
			promise
			.then(function(promisesData) {
				var tasks = [];
				angular.forEach(promisesData, function(data) {

					if (that.catsProfile === "DEV2002C") {
						tasks.push({
							RAUFNR: "",
							TASKTYPE: "ADMI",
							ZCPR_EXTID: "",
							ZCPR_OBJGEXTID: "",
							ZZSUBTYPE: "",
							DESCR: "Admin"
						});
						tasks.push({
							RAUFNR: "",
							TASKTYPE: "EDUC",
							ZCPR_EXTID: "",
							ZCPR_OBJGEXTID: "",
							ZZSUBTYPE: "",
							DESCR: "Education"
						});
					}

					if (data && data.TIMESHEETS && data.TIMESHEETS.RECORDS) {
						var nodes = data.TIMESHEETS.RECORDS;
						for (var i = 0; i < nodes.length; i++) {
							var task = {};
							task.RAUFNR = (nodes[i].RAUFNR || "");
							task.TASKTYPE = (nodes[i].TASKTYPE || "");
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
				if (catsProfile !== "DEV2002C") {
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
								task.UNIT = nodes[i].UNIT || "T"; // T is default unit for cPro
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

		this.writeCATSData = function(container) {
			var deferred = $q.defer();
			this.determineCatsProfileFromBackend().then(function(catsProfile) {
				$http.post(WRITECATSDATA_WEBSERVICE + "&DATAFORMAT=CATSDB&catsprofile=" + catsProfile, container, {
					'timeout': 60000,
					'headers': {
						'Content-Type': 'text/plain'
					}
				}).success(function(data) {
					deferred.resolve(data);
				}).error(function(data, status) {
					deferred.reject(status);
				});
			});
			return deferred.promise;
		};
	}
]);
