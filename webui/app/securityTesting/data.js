angular.module("app.securityTesting.data", [])
	.service("app.securityTesting.dataService", ["$http", "$q",
	function ($http, $q) {
		    this.data = {};
		    this.data.transportData = {};
		    this.data.fortifyResults = 0;
            this.data.coverityResults = 0;

            this.loadData = function () {
                var deferred = $q.defer();
                var url = 'https://pulsecsi.mo.sap.corp:1443/results/count';
                var that = this;
                $http.get(url, { withCredentials: false }).success(function (data) {
                    that.data.securityTestingData = data.count;
                    deferred.resolve();
                });
                return deferred.promise;
            };

            this.loadDataDetailed = function (system) {
                var deferred = $q.defer();
                var url = 'https://pulsecsi.mo.sap.corp:1443/results/detail/' + system;
                var that = this;
                $http.get(url, { withCredentials: false }).success(function (data) {
                    that.data.securityTestingDetail = data.details;

                    deferred.resolve();
                });
                return deferred.promise;
            };
}]);
