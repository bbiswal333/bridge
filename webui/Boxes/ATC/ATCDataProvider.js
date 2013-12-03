var IATCDataProvider = {
		getResultForConfig : function(config, scope) { throw "Not Implemented"; },
};

var ATCDataProvider = function(http){
	this.http = http;
};

ATCDataProvider.prototype = Object.create(IATCDataProvider);

ATCDataProvider.prototype.getResultForConfig = function (config, scope) {
	scope.atcData = {
		prio1: 10,
		prio2: 0,
		prio3: 0,
		prio4: 0
	};

	this.http.get('http://localhost:8000/api/atc?query=' + config.getQueryString() + '&count_prios=X&format=json').success(function(data) {

		scope.atcData = {
			prio1: data.PRIOS.PRIO1,
			prio2: data.PRIOS.PRIO2,
			prio3: data.PRIOS.PRIO3,
			prio4: data.PRIOS.PRIO4
		};

	});
};