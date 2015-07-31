angular.module('app.hydrationMeter').service("app.hydrationMeter.configService", function () {

	this.values = {
		targetCups : 10,
		currentCups : 0,
		date: "",
		notify : true,
		lastTimeDrank : 0
	};

	this.defaultValues = {
		targetCups : 10,
		currentCups : 0,
		date: "",
		notify : true,
		lastTimeDrank : 0
	};

	this.initialize = function(configLoadedFromBackend) {
		var today = new Date();
		var todayString = "" + today.getFullYear() + " " + today.getMonth() + " " + today.getDate();
		if (this.values.date == "") {
			this.values.date = todayString;
		};
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
		this.values.lastTimeDrank = (new Date()).getTime();
	};

	this.resetData = function() {
		var today = new Date();
		var todayString = "" + today.getFullYear() + " " + today.getMonth() + " " + today.getDate();
		this.defaultValues.date = todayString;
		this.defaultValues.lastTimeDrank = today.getTime();
		this.defaultValues.targetCups = this.values.targetCups;
		this._clone(this.defaultValues);
	};
	this._clone = function(oldValues) {
		this.values.targetCups = oldValues.targetCups;
		this.values.currentCups = oldValues.currentCups;
		this.values.date = oldValues.date;
	};
});
