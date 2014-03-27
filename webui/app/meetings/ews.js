angular.module("app.meetings.ews", ["lib.utils"]).factory("app.meetings.ewsUtils", ["lib.utils.calUtils", function (calUtils) {
	var EWS_BASE_URL = "http://localhost:8000/api/CalDataSSO";

	function _buildEWSUrl (dateFrom_o, days_i) {
		var dateFrom_s = buildDateString(dateFrom_o);
		var dateTo_s = buildDateString(new Date(dateFrom_o.getTime() + (days_i * 86400000))); //Adds days by multiplying the milliseconds of one day

		return EWS_BASE_URL + "?from=" + encodeForUrl(dateFrom_s) + "&to=" + encodeForUrl(dateTo_s) + "&format=json";
	
		function buildDateString (date_o) {
			var year = date_o.getFullYear();
			var month = calUtils.useNDigits(date_o.getMonth() + 1, 2);
			var day = calUtils.useNDigits(date_o.getDate(), 2);
			var hour = calUtils.useNDigits(date_o.getHours(), 2);
			var minute = calUtils.useNDigits(date_o.getMinutes(), 2);
			var second = calUtils.useNDigits(date_o.getSeconds(), 2);

			return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "Z"; 
		}

		function encodeForUrl (val_s) {
			return encodeURIComponent(val_s).replace(/'/g,"%27").replace(/"/g,"%22");
		}
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

	return {
		buildEWSUrl: function(dateFrom_o, days_i) {
			return _buildEWSUrl(dateFrom_o, days_i);
		},
		parseEWSDateString: function (ewsDateStr_s, offsetUTC_i) {
			return _parseEWSDateString(ewsDateStr_s, offsetUTC_i);		
		},
		parseEWSDateStringAutoTimeZone: function (ewsDateStr_s) {
			return _parseEWSDateString(ewsDateStr_s, (new Date().getTimezoneOffset() / -60));			
		}
	};
}]);