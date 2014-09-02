angular.module("app.test.data", []).service("app.test.dataService", function () {

	var text = "Welcome text from DataService";
	var reloadCounter = 0;

	this.reload = function() {
		reloadCounter += 1;
	};

	this.getText = function() {
		return text + ', data was reloaded ' + reloadCounter + ' time(s)';
	};

	this.getReloadCounter = function() {
		return reloadCounter;
	};
});
