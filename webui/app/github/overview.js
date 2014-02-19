angular.module('app.github', []);

angular.module('app.github').directive('app.github', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        $scope.boxTitle = "Github";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe009;';    

        $scope.reposList = new Array("tools/bridge","monsoon/monsoon-documentation-ui");
 
        /*
         $http({method: 'GET', url: 'https://github.wdf.sap.corp/api/v3/users/D059273'}).
            success(function(data, status, headers, config) {
                $scope.userData = data;
            }).error(function(data, status, headers, config) {});
       

        //Tags
        $http({method: 'GET', url: 'https://github.wdf.sap.corp/api/v3/repos/Tools/bridge/tags'}).
            success(function(data, status, headers, config) {
                $scope.tags = data;
            }).error(function(data, status, headers, config) {});


        //ISSUES open
        $http({method: 'GET', url: 'https://github.wdf.sap.corp/api/v3/repos/Tools/bridge/issues?state=open&per_page=200'}).
            success(function(data, status, headers, config) {
                $scope.issuesOpen = data;
                console.log($scope.issuesOpen)
            }).error(function(data, status, headers, config) {});

             */

        //Labels
        $http({method: 'GET', url: 'https://github.wdf.sap.corp/api/v3/repos/Tools/bridge/labels'}).
            success(function(data, status, headers, config) {
                $scope.labels = data;
  


            }).error(function(data, status, headers, config) {});

        //ISSUES open
        $http({method: 'GET', url: 'https://github.wdf.sap.corp/api/v3/repos/Tools/bridge/issues?state=open&per_page=200'}).
            success(function(data, status, headers, config) {
                $scope.openIssues = data;
           

            }).error(function(data, status, headers, config) {});








                 //console.log($scope.tags);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/github/overview.html',
        controller: directiveController
    };
});

