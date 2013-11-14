var IATCDataProvider = {
		getResultForConfig : function(config) { throw "Not Implemented"; },
};

var ATCDataProvider = function(http){
	this.http = http;
};

ATCDataProvider.prototype = Object.create(IATCDataProvider);

ATCDataProvider.prototype.getResultForConfig = function(config) {
	var resultData = undefined;
	this.http.get('https://ifd.wdf.sap.corp/sap/bc/devdb/STAT_CHK_RESULT?query=' + config.getQueryString() + '&format=json').success(function(data) {
		resultData = data.DATA;
    });
	
	var enumerable = Enumerable.From(resultData);

	var getNumberOfMessagesForPrio = function(prio) {
		return enumerable.Where(function(item) {
			return item.CHECK_MSG_PRIO == prio;
		}).Count();
	};
	
	return {prio1: getNumberOfMessagesForPrio(1),
			prio2: getNumberOfMessagesForPrio(2),
			prio3: getNumberOfMessagesForPrio(3),
			prio4: getNumberOfMessagesForPrio(4)};
};