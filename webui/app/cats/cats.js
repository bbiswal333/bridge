angular.module("app.cats.data", ["app.cats.utils"]).factory("app.cats.catsUtils", ["$http", "app.cats.encodeForUrl", function ($http, encodeForUrl) {
	const NODE_GET_API = "http://localhost:8000/api/get?url=";
	const CATS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA";
	var url = NODE_GET_API + encodeForUrl.encode(CATS_WEBSERVICE) + "&json=true";

	function _requestCatsData (callback_fn) {
		$http.get(url).success(function (data, status) {
			if (between(status, 200, 299)) {
				callback_fn(eval(data));
			}
		}).error(function (data, status, header, config) {
			console.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
			callback_fn(null);
		});

		function between (val_i, min_i, max_i) {
			return (val_i >= min_i && val_i <= max_i);
		}
	}

	function _getDescForState (state_s) {
		state_s = state_s.toLowerCase();
		if (state_s == "r") {
			return "Not maintained";
		}
		if (state_s == "y") {
			return "Partially maintained";
		}
		if (state_s == "g") {
			return "Maintained";
		}
		if (state_s == "n") {
			return "No need for maintenance";
		}
	}

	return {
		getData: function (callback_fn) {		//Returns either an object generated from json string or null in case Request wasn't successful. In the last case the method will internaly invoke a console.log()
			return _requestCatsData(callback_fn);
		},
		getDescForState: function (state_s) {
			return _getDescForState(state_s);
		}
	};
}]);