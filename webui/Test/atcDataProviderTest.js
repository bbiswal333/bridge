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

	var scope = {};
	httpMock.defaults = {};
	
	var atcDataProvider = new ATCDataProvider(httpMock);
	equal(atcDataProvider.http, httpMock, 'http object set');
	
	var config = new Config();
	
	atcDataProvider.getResultForConfig(config, scope);

	equal(scope.atcData.prio1, 240, 'number of prio1 messages test');
	equal(scope.atcData.prio2, 5, 'number of prio2 messages test');
	equal(scope.atcData.prio3, 11343, 'number of prio3 messages test');
	equal(scope.atcData.prio4, 5446, 'number of prio4 messages test');
});