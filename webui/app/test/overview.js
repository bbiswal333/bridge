angular.module('app.test', []);
angular.module('app.test').directive('app.test', ['$http', function () {

    var directiveController = ['$scope', function ($scope, $http)
    {/*
        function _loadFromIsp(callback) {
            $http({
                    method: 'GET',
                    url: window.client.origin + "/api/CalDataSSO"; 
                }).success(function(data){
        //data.RESERVATIONS.forEach(extractDates);
                    alert(JSON.stringify(data));
                    callback(data);
      }).error(function(){
          alert("error");
      });
    }
        _loadFromIsp(function(data){console.log(data);});
        */
    }];
    
    
    
    return {
        restrict: 'E',
        templateUrl: 'app/test/overview.html',
        controller: directiveController
    };
}]);
