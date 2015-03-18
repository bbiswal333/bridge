angular.module("app.junit.data", []).service("app.junit.dataService", ["$http", "$q", "app.junit.configService",
	function ($http, $q, configService) {
    var Data = function(_appId) {

      var appId = _appId;

      this.data = {};

      this.loadData = function() {
        var promises = [];

        configService.getConfigForAppId(appId).getConfigItems().forEach(function(configItem) {
          var deferred = $q.defer();

          $http.get(configItem.url).success(function(data, status, headers, config) {

            var JSONdata = new X2JS().xml_str2json(data);
            var result = {};

            result.testSuites = JSONdata.testsuites;

            result.numFailedTestCases = result.testSuites._failures ? parseInt(result.testSuites._failures) : 0;
            result.numErrorTestCases = result.testSuites._errors ? parseInt(result.testSuites._errors) : 0;

            if(result.testSuites._tests) {
              result.numSuccessTestCases = result.testSuites._tests - ( result.numFailedTestCases + result.numErrorTestCases );
            }
            else {
              result.numSuccessTestCases = 0;
            }

            deferred.resolve({
              url : config.url,
              result : result
            });
          }).error(function() {
            deferred.reject();
          });

          promises.push(deferred.promise);
        });

        return promises;
      };
    };

    var dataInstances = {};

    this.getInstanceForAppId = function(appId) {
      if(dataInstances[appId] === undefined) {
        dataInstances[appId] = new Data(appId);
      }
      return dataInstances[appId];
    };
}]);
