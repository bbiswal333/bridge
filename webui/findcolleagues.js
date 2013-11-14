//define module
var userApp = angular.module('userApp', ['userServices']);

//add user resource
var userServices = angular.module('userServices', ['ngResource']);
userServices.factory('Users', function($resource){
    return $resource('https://ifd.wdf.sap.corp/sap/bc/abapcq/user_data_json', {}, { query: { method: 'GET', cache: true, params: {search:""}, isArray : false } } );

});

//add controller        
userApp.controller('UserCtrl', ['$scope', 'Users', function($scope, Users) {
  $scope.users = [];  

  Users.query(function(response) {      
    $scope.users = response['DATA'];
  });

  $scope.dosearch = function() {
    if(!$scope.search) $scope.search = "";
    Users.query({search: $scope.search}, function(response) {

      $scope.users = response['DATA'];
      $scope.updateTime = $scope.responseTime;

    });
  };

}]);



