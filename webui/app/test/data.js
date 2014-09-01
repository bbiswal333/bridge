angular.module("app.test.data", [])
	.service("app.test.dataService",
	function () {

	this.data = {};
	this.data.number = 0;
	this.data.text = "Welcome text from DataService";

	this.getText = function() {
		this.data.number += 1;
		return this.data.text + ' ' + this.data.number;
	};
});
