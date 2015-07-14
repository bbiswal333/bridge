angular.module("app.wikipedia.data", []).service(
	"app.wikipedia.dataService",
	function () {
		var data = "bridge";

		var getData = function() {
			return data;
		};

		 var setData = function(userInput) {
			data = userInput;
		};

		return {
			setData: setData,
			getData: getData
		};
	}
);
