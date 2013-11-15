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

	this.http.get('https://ifd.wdf.sap.corp/sap/bc/devdb/STAT_CHK_RESULT?query=' + config.getQueryString() + '&format=json').success(function(data) {

	    var enumerable = Enumerable.From(data.DATA);

	    var getNumberOfMessagesForPrio = function (prio) {
	        return enumerable.Where(function (item) {
	            return item.CHECK_MSG_PRIO == prio;
	        }).Count();
	    };

	    scope.atcData = {
	        prio1: getNumberOfMessagesForPrio(1),
	        prio2: getNumberOfMessagesForPrio(2),
	        prio3: getNumberOfMessagesForPrio(3),
	        prio4: getNumberOfMessagesForPrio(4)
	    };
    });
};