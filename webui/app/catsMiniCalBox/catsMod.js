angular.module("cats", []).factory("catsDataRequest", function ($http, encodeForUrl) {
	const NODE_GET_API = "http://localhost:8000/api/get?url=";
	const CATS_WEBSERVICE = "https://isp.wdf.sap.corp/sap/bc/zdevdb/MYCATSDATA";
	var url = NODE_GET_API + encodeForUrl.encode(CATS_WEBSERVICE) + "&json=true";

	function _requestCatsData (callback_fn) {
		$http.get(url).success(function (data, status) {
			if (between(status, 200, 299)) {
				console.log("Data:");
				console.log(eval(data));
				callback_fn(eval(data));
			}

			console.log(status);
		}).error(function (data, status, header, config) {
			console.log("GET-Request to " + url + " failed. HTTP-Status: " + status + ".\nData provided by server: " + data);
			callback_fn(null);
		});

		function between (val_i, min_i, max_i) {
			return (val_i >= min_i && val_i <= max_i);
		}
	}

	return {
		getData: function (callback_fn) {		//Returns either an object generated from json string or null in case Request wasn't successful. In the last case the method will internaly invoke a console.log()
			return _requestCatsData(callback_fn);
		}
	};
});