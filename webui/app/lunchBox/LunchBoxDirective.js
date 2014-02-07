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

        
        $http.get('http://localhost:8000/api/get?url=' + encodeURI('http://155.56.69.85:1081/lunch_de.txt') + '&decode=win1252'
        ).success(function(data, status, headers, config) {            
            
            var weekday = new Date().getDay() - 1;
            var lunchstring = data.split('************')[weekday];
            $scope.lunch = lunchstring;        

            /*NSRange soupRange = [text rangeOfString:de?@"Suppe:":@"Soup:"];
            NSRange main1Range = [text rangeOfString:de?@"Hauptgericht:":@"Main course:"];
            NSRange main2Range = [text rangeOfString:de?@"Oder:":@"Or:"];
            NSRange sideDishesRange = [text rangeOfString:de?@"Beilagen:":@"Side dishes:"];
            NSRange dessertRange = [text rangeOfString:de?@"Dessert:":@"Dessert:"];
            NSRange header = [text rangeOfString:de?@"Speiseplan Walldorf":@"Weekly Menu Walldorf"];
            NSRange resultRange;*/

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