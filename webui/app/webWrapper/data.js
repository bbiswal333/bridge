angular.module("app.webWrapper.data", []).service(
	"app.webWrapper.dataService", 
	
	function () {
		var input = "";
		var url = "";
	
		var getInput = function() {
			return input;
		};
	
		 var setInput = function(userInput) {
			input = userInput;
		};
		
		var getUrl = function() {
			return url;
		};
	
		 var setUrl = function(configUrl) {
			url = configUrl;
		};
		
		return {
			setInput: setInput,
			getInput: getInput,
			setUrl: setUrl,
			getUrl: getUrl
		};
	}
);
