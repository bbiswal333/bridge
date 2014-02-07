angular.module("ews", []).factory("ewsUtils", function () {
	var EWS_BASE_URL = "/api/CalDataSSO";

	function _buildEWSUrl (dateFrom_o, days_i) {
		var dateFrom_s = buildDateString(dateFrom_o);
		var dateTo_s = buildDateString(new Date(dateFrom_o.getTime() + (days_i * 86400000))); //Adds days by multiplying the milliseconds of one day

		return EWS_BASE_URL + "?from=" + encodeForUrl(dateFrom_s) + "&to=" + encodeForUrl(dateTo_s) + "&format=json";
	
		function buildDateString (date_o) {
			var year = date_o.getFullYear();
			var month = _useNDigits(date_o.getMonth() + 1, 2);
			var day = _useNDigits(date_o.getDate(), 2);
			var hour = _useNDigits(date_o.getHours(), 2);
			var minute = _useNDigits(date_o.getMinutes(), 2);
			var second = _useNDigits(date_o.getSeconds(), 2);

			return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "Z"; 
		}

		function encodeForUrl (val_s) {
			return encodeURIComponent(val_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}
	}

	//Tested by a separate test
	function _useNDigits (val_i, n_i) {
		var str = new String(val_i);

		for (var i = str.length; i < n_i; i++) {
			str = "0" + str;
		}

		return str;
	}

	function _parseEWSDateString (ewsDateStr_s, offsetUTC_i) {
		var s = ewsDateStr_s;

		//Check whether this string seems to be valid
		if (s.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/) == -1) {
			return null;
		}

		var year = s.substr(0, 4);
		var month = parseInt(s.substr(5, 2)) - 1;
		var day = s.substr(8, 2);
		var hour = s.substr(11, 2);
		var minute = s.substr(14, 2);
		var second = s.substr(17, 2);

		var d = new Date(year, month, day, hour, minute, second);

		return new Date(d.getTime() + (offsetUTC_i * 3600000)); //3600000 milliseconds are one hour
	}	

	function _relativeTimeTo(dateFrom_o, dateTo_o) {
		var diffMin = dateTo_o.getTime() - dateFrom_o.getTime();
		diffMin = Math.floor(diffMin / 60000);

		var days = Math.floor(diffMin / (24 * 60));
		diffMin = diffMin - days * 24 * 60;

		var hours = Math.floor(diffMin / 60);
		diffMin = diffMin - hours * 60;

		var res = "";
		if (days > 0) {
			res += days + ((days == 1) ? " day, " : " days, ");
		}
		if (hours > 0) {
			res += hours + ((hours == 1) ? " hour, " : " hours, ");
		}
		res += diffMin + ((diffMin == 1) ? " minute" : " minutes");

		return res;
	}


	return {
		buildEWSUrl: function(dateFrom_o, days_i) {
			return _buildEWSUrl(dateFrom_o, days_i);
		},
		parseEWSDateString: function (ewsDateStr_s, offsetUTC_i) {
			return _parseEWSDateString(ewsDateStr_s, offsetUTC_i);		
		},
		parseEWSDateStringAutoTimeZone: function (ewsDateStr_s) {
			return _parseEWSDateString(ewsDateStr_s, (new Date().getTimezoneOffset() / -60));			
		},
		relativeTimeTo: function (dateFrom_o, dateTo_o) {
			return _relativeTimeTo(dateFrom_o, dateTo_o);
		},
		useNDigits: function (val_i, n_i) {
			return _useNDigits (val_i, n_i);
		}
	};
});