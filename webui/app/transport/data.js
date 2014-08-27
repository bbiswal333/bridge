angular.module("app.transport.data", [])
	.service("app.transport.dataService", ["$http", "$q",
	function ($http, $q) {

		this.data = {};
		this.data.transportData = {};
		this.data.openTransports = 0;
		this.data.failedTransports = 0;

		this.loadData = function() {
			var deferred = $q.defer();
			var url = 'https://ifp.wdf.sap.corp/sap/bc/devdb/MYTRANSPORTS?user=D052766&origin=' + location.origin;
			var that = this;
			$http.get(url).success(function(data){
				var JSONdata = new X2JS().xml_str2json(data);
				that.data.transportData = JSONdata.abap.values;
				if (that.data.transportData.OTRANSPORT_SHORT) {
					that.data.openTransports = that.data.transportData.OTRANSPORT_SHORT.NUMBOTRP;
				}
				if (that.data.transportData.FTRANSPORT_SHORT) {
					that.data.failedTransports = that.data.transportData.FTRANSPORT_SHORT.NUMBIMPERR;
				}
				deferred.resolve();
			});
			return deferred.promise;
		};
}]);
