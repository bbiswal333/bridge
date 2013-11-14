module("dataProvider");
test( "test get ATC Data for Config", function() {
	var httpMock = {
			get: function() {
				return {
					success: function(succFunc){
						succFunc(testData);
					}
				};
			}
	};
	
	httpMock.defaults = {};
	
	var atcDataProvider = new ATCDataProvider(httpMock);
	equal(atcDataProvider.http, httpMock, 'http object set');
	
	var config = new Config();
	
	equal(atcDataProvider.getResultForConfig(config).prio1, 240, 'number of prio1 messages test');
	equal(atcDataProvider.getResultForConfig(config).prio2, 5, 'number of prio2 messages test');
	equal(atcDataProvider.getResultForConfig(config).prio3, 11343, 'number of prio3 messages test');
	equal(atcDataProvider.getResultForConfig(config).prio4, 5446, 'number of prio4 messages test');
});