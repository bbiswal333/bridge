angular.module('app.hydrationMeter').service("app.hydrationMeter.configService", function () {

	this.values = {
		targetCups : 10,
		currentCups : 0,
		date: ""
	};

	this.defaultValues = {
		targetCups : 10,
		currentCups : 0,
		date: ""
	};

	this.initialize = function(configLoadedFromBackend) {
		var today = new Date();
		var todayString = "" + today.getFullYear() + " " + today.getMonth() + " " + today.getDate();
		if (this.values.date == "") {
			this.values.date = todayString;
		};
		console.log(configLoadedFromBackend.values.date);
		if (configLoadedFromBackend !== undefined && configLoadedFromBackend !== {} &&	configLoadedFromBackend.values && configLoadedFromBackend.values.date !== todayString )
		{
			// Standard case: Get config from backend
			this.values = configLoadedFromBackend.values;
		} else {
			// Use default config on first load
			configLoadedFromBackend.values = this.values;
		}
	};

	this.drankCup = function(cups) {
		this.values.currentCups += cups;
	};

	this.resetData = function() {
		var today = new Date();
		var todayString = "" + today.getFullYear() + " " + today.getMonth() + " " + today.getDate();
		this.defaultValues.date = todayString;
		this._clone(this.defaultValues);
	};
	this._clone = function(oldValues) {
		this.values.targetCups = oldValues.targetCups;
		this.values.currentCups = oldValues.currentCups;
		this.values.date = oldValues.date;
	};
});
