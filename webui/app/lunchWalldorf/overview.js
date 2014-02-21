angular.module('app.lunchWalldorf', ["lib.utils"]).directive('app.lunchWalldorf', ["$timeout", "lib.utils.calUtils", function ($timeout, calUtils) {
    var directiveController = ['$scope', '$http', function ($scope, $http) {
        
        $scope.boxTitle = "Lunch Walldorf/ Rot";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe0d5;';
        $scope.loading = true;
    
        $http.get('/api/get?url=' + encodeURI('http://155.56.69.85:1081/lunch_de.txt') + '&decode=win1252'
        ).success(function(data, status, headers, config) {            

            var date = new Date();
            var weekday = date.getDay() - 1;
            var hour = date.getHours();

            if (weekday >= 0 && weekday <= 3 && hour > 13 ){
                date.setDate( date.getDate() + 1 )
                weekday = date.getDay() - 1;
            }

            var lunchstring = data.split('************')[weekday];
            $scope.date = calUtils.getWeekdays()[date.getDay() - 1].short + "., " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).short + ".";

            var lunchLines = lunchstring.split("\n");
            var lunchMenu = {};
            var previousLineCategory;
            for(var i = 0; i < lunchLines.length; i++) {
                if (lunchLines[i].indexOf("Suppe:") != -1) {
                    lunchMenu.soup = lunchLines[i].substring(lunchLines[i].indexOf("Suppe:") + "Suppe:".length).replace(/^\s+|\s+$/g, '');
                    previousLineCategory = "soup";
                }
                else if (lunchLines[i].indexOf("Hauptgericht:") != -1) {
                    lunchMenu.mainCourse = [];
                    lunchMenu.mainCourse.push(lunchLines[i].substring(lunchLines[i].indexOf("Hauptgericht:") + "Hauptgericht:".length).replace(/^\s+|\s+$/g, ''));
                    previousLineCategory = "mainCourse";
                }
                else if (lunchLines[i].indexOf("Oder:") != -1) {
                    lunchMenu.mainCourse.push(lunchLines[i].substring(lunchLines[i].indexOf("Oder:") + "Oder:".length).replace(/^\s+|\s+$/g, ''));
                    previousLineCategory = "mainCourse";
                }
                else if (lunchLines[i].indexOf("Beilagen:") != -1) {
                    lunchMenu.sideDishes = lunchLines[i].substring(lunchLines[i].indexOf("Beilagen:") + "Beilagen:".length).replace(/^\s+|\s+$/g, '');
                    previousLineCategory = "sideDish";
                }
                else if (lunchLines[i].indexOf("Dessert:") != -1) {
                    lunchMenu.dessert = lunchLines[i].substring(lunchLines[i].indexOf("Dessert:") + "Dessert:".length).replace(/^\s+|\s+$/g, '');
                    previousLineCategory = "dessert";
                }
                else {
                    switch (previousLineCategory) {
                        case "soup":
                            lunchMenu.soup += ' ' + lunchLines[i].replace(/^\s+|\s+$/g, '');
                            break;
                        case "mainCourse":
                            lunchMenu.mainCourse[lunchMenu.mainCourse.length - 1] += ' ' + lunchLines[i].replace(/^\s+|\s+$/g, '');
                            break;
                        case "dessert":
                            lunchMenu.dessert += ' ' + lunchLines[i].replace(/^\s+|\s+$/g, '');
                            break;
                        case "sideDish":
                            lunchMenu.sideDishes += ' ' + lunchLines[i].replace(/^\s+|\s+$/g, '');
                            break;
                    }
                }

            }

            $scope.lunch = lunchMenu;
            $scope.loading = false;

            $timeout(function () {
                $scope.$broadcast('recalculateScrollbars');
            }, 300);

        }).error(function(data, status, headers, config) {
            console.log(data);
        });

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/lunchWalldorf/overview.html',
        controller: directiveController
        };
    
}]);