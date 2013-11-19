module("dataProvider");
test( "test get ATC Data for Config", function() {
	var httpMock = {
			get: function() {
				return {
					success: function(succFunc){
						succFunc(atcCountData);
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

	equal(scope.atcData.prio1, 985, 'number of prio1 messages test');
	equal(scope.atcData.prio2, 438, 'number of prio2 messages test');
	equal(scope.atcData.prio3, 11377, 'number of prio3 messages test');
	equal(scope.atcData.prio4, 3766, 'number of prio4 messages test');
});