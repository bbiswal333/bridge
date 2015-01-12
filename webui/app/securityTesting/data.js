angular.module("app.securityTesting.data", [])
	.service("app.securityTesting.dataService", ["$http", "$q", "$window",
	function ($http, $q, $window) {
		    this.data = {};
		    this.data.transportData = {};
		    this.data.fortifyResults = 0;
            this.data.coverityResults = 0;

            this.loadData = function () {
                var deferred = $q.defer();
                var url = 'https://localhost:1443/results/count/open?origin=' + $window.location.origin;
                var that = this;
                $http.get(url, { withCredentials: false }).success(function (data) {
                    that.data.securityTestingData = data.count;
                    
                    
                    deferred.resolve();
                });
                return deferred.promise;
            };

            this.loadDataDetailed = function (system) {
                var deferred = $q.defer();
                var url = 'https://localhost:1443/results/detail/' +system;
                var that = this;
                $http.get(url, { withCredentials: false }).success(function (data) {
                    that.data.securityTestingDetail = data.details;
                    
                    
                    deferred.resolve();
                });
                return deferred.promise;
            };
}]);
