angular.module("app.test.data", []).service("app.test.dataService", function () {

	var text = "Text from DataService";
	var reloadCounter = 0;

	this.reload = function() {
		reloadCounter += 1;
	};

	this.getText = function() {
		return text + ', app was refreshed ' + reloadCounter + ' time(s).';
	};

	this.getReloadCounter = function() {
		return reloadCounter;
	};
});
