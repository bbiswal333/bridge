var testBoxApp = angular.module('lunchBoxApp', []);

testBoxApp.directive('lunchbox', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        $scope.boxTitle = "Lunch Walldorf/ Rot";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe0d5;';

        $scope.settings = {
            templatePath: "lunchBox/LunchBoxSettingsTemplate.html",
            controller: undefined,
            id: $scope.boxId
        };

        
        $http.get('http://localhost:8000/api/get?url=' + encodeURI('http://155.56.69.85:1081/lunch_de.txt')
        ).success(function(data, status, headers, config) {
            $scope.lunch = data;
        }).error(function(data, status, headers, config) {
            console.log(data);
        });

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/lunchBox/LunchBoxDirective.html',
        controller: directiveController
        };
    
});