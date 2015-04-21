var TimeService = (function() {
	var path = require('path');
	var fs = require('fs');
	var csv = require('csv');

	return function(callback) {
		var countries = {};

		var timeZones;
		var timeZonesCallbacks = [];
		var timeZonesInitialized = false;

		var timeZoneDetails = {};
		var timeZoneDetailsCallbacks = [];
		var timeZoneDetailsInitialized = false;

		function notifyTimeZoneCallbacks() {
			timeZonesCallbacks.map(function(cb) {
				cb(timeZones);
			});
			timeZonesCallbacks.length = 0;
		}

		function notifyTimeZoneDetailCallbacks() {
			timeZoneDetailsCallbacks.map(function(cb) {
				cb.cb(getTimeOffsetFor(cb.timeZone));
			});
			timeZoneDetailsCallbacks.length = 0;
		}

		function initializeCountries() {
			fs.readFile(path.join(__dirname, 'timezonedb.csv', 'country.csv'), {encoding: "utf8"}, function(error, data) {
				if(error) {
					throw new Error(error);
				}

				csv.parse(data, {columns: ["countryCode", "countryName"]}, function(csvError, csvData) {
					csvData.map(function(country) {
						countries[country.countryCode] = country.countryName;
					});
					initializeTimeZones();
				});
			});
		}

		function sortTimeZones() {
			timeZones = timeZones.sort(function(a, b) {
				var aLabel = a.country + a.city;
				var bLabel = b.country + b.city;
				if(aLabel > bLabel) {
					return 1;
				} else if(aLabel < bLabel) {
					return -1;
				} else {
					return 0;
				}
			});
		}

		function initializeTimeZones() {
			fs.readFile(path.join(__dirname, 'timezonedb.csv', 'zone.csv'), {encoding: "utf8"}, function(error, data) {
				if(error) {
					throw new Error(error);
				}

				csv.parse(data, {columns: ["zoneID", "countryCode", "zoneName"]}, function(csvError, csvData) {
					timeZones = csvData;
					timeZones.map(function(timeZone) {
						timeZone.country = countries[timeZone.countryCode];
						var zoneNameSplitted = timeZone.zoneName.split("/");
						timeZone.city = zoneNameSplitted[zoneNameSplitted.length - 1].replace("_", " ");
					});
					sortTimeZones();
					timeZonesInitialized = true;
					notifyTimeZoneCallbacks();
				});
			});
		}

		function sortTimeZoneDetails() {
			for(var zoneID in timeZoneDetails) {
				timeZoneDetails[zoneID] = timeZoneDetails[zoneID].sort(function(a, b) {
					if(parseInt(a.timeStart) > parseInt(b.timeStart)) {
						return -1;
					} else if(parseInt(a.timeStart) < parseInt(b.timeStart)) {
						return 1;
					} else {
						return 0;
					}
				});
			}
		}

		function initializeTimeZoneDetails() {
			fs.readFile(path.join(__dirname, 'timezonedb.csv', 'timezone.csv'), {encoding: "utf8"}, function(error, data) {
				if(error) {
					throw new Error(error);
				}

				csv.parse(data, {columns: ["zoneID", "abbreviation", "timeStart", "GMTOffset", "DST"]}, function(csvError, csvData) {
					csvData.map(function(zoneDetail) {
						if(!timeZoneDetails[zoneDetail.zoneID]) {
							timeZoneDetails[zoneDetail.zoneID] = [];
						}
						timeZoneDetails[zoneDetail.zoneID].push(zoneDetail);
					});
					sortTimeZoneDetails();
				});
				timeZoneDetailsInitialized = true;
				notifyTimeZoneDetailCallbacks();
			});
		}

		this.getTimeZones = function(cb) {
			if(timeZonesInitialized) {
				cb(timeZones);
			} else {
				timeZonesCallbacks.push(cb);
			}
		};

		function getUnixTimestamp() {
			return Math.round((new Date()).getTime() / 1000);
		}

		function getTimeOffsetFor(timeZoneID) {
			for(var i = 0, length = timeZoneDetails[timeZoneID].length; i < length; i++) {
				if(timeZoneDetails[timeZoneID][i].timeStart < getUnixTimestamp()) {
					return parseInt(timeZoneDetails[timeZoneID][i].GMTOffset);
				}
			}
			return 0;
		}

		this.getTimeOffsetFor = function(timeZone, cb) {
			if(timeZoneDetailsInitialized) {
				cb(getTimeOffsetFor(timeZone));
			} else {
				timeZoneDetailsCallbacks.push({cb: cb, timeZone: timeZone});
			}
		};

		initializeCountries();
		initializeTimeZoneDetails();
	};
})();

module.exports = TimeService;