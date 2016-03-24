angular.module("app.junit.data", []).service("app.junit.dataService", ["$http", "$q", "app.junit.configService",
	function ($http, $q, configService) {
    function getTestCasesPropertySum(testSuites, property) {
      var result = 0;
      testSuites.map(function(testSuite) {
        result += testSuite[property] ? parseInt(testSuite[property]) : 0;
      });
      return result;
    }

    var Data = function(_appId) {

      var appId = _appId;

      this.data = {};

      this.loadData = function() {
        var promises = [];

        configService.getConfigForAppId(appId).getConfigItems().forEach(function(configItem) {
          var deferred = $q.defer();

          var url = configItem.url;
          if(url.indexOf("http://") === 0) {
            url = "/api/get?url=" + encodeURIComponent(url);
          }

          $http.get(url).success(function(data, status, headers, config) {

            var JSONdata = new X2JS().xml_str2json(data);
            var result = {};

            result.testSuites = JSONdata.testsuites;

            result.numFailedTestCases = result.testSuites._failures ? parseInt(result.testSuites._failures) : getTestCasesPropertySum(result.testSuites.testsuite, '_failures');
            result.numErrorTestCases = result.testSuites._errors ? parseInt(result.testSuites._errors) : getTestCasesPropertySum(result.testSuites.testsuite, '_errors');
            result.numTestCases = result.testSuites._tests ? parseInt(result.testSuites._tests) : getTestCasesPropertySum(result.testSuites.testsuite, '_tests');
            result.numSuccessTestCases = result.numTestCases - ( result.numFailedTestCases + result.numErrorTestCases );

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
