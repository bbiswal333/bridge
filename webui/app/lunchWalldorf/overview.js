angular.module('app.lunchWalldorf', []);

angular.module('app.lunchWalldorf').directive('app.lunchWalldorf', function ($timeout) {
    var directiveController = ['$scope', '$http', function ($scope, $http) {
        
        $scope.boxTitle = "Lunch Walldorf/ Rot";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe0d5;';
        $scope.loading = true;
    
        $http.get('/api/get?url=' + encodeURI('http://155.56.69.85:1081/lunch_de.txt') + '&decode=win1252'
        ).success(function(data, status, headers, config) {            
            
            var weekday = new Date().getDay() - 1;
            var lunchstring = data.split('************')[weekday];

            var lunchLines = lunchstring.split("\n");
            var lunchMenu = {};
            for(var i = 0; i < lunchLines.length; i++) {
                if (lunchLines[i].indexOf("Suppe:") != -1)
                    lunchMenu.soup = lunchLines[i].substring(lunchLines[i].indexOf("Suppe:") + "Suppe:".length).replace(/^\s+|\s+$/g, '');
                if (lunchLines[i].indexOf("Hauptgericht:") != -1) {
                    lunchMenu.mainCourse = [];
                    lunchMenu.mainCourse.push(lunchLines[i].substring(lunchLines[i].indexOf("Hauptgericht:") + "Hauptgericht:".length).replace(/^\s+|\s+$/g, ''));
                }
                if (lunchLines[i].indexOf("Oder:") != -1)
                    lunchMenu.mainCourse.push(lunchLines[i].substring(lunchLines[i].indexOf("Oder:") + "Oder:".length).replace(/^\s+|\s+$/g, ''));
                if (lunchLines[i].indexOf("Beilagen:") != -1)
                    lunchMenu.sideDishes = lunchLines[i].substring(lunchLines[i].indexOf("Beilagen:") + "Beilagen:".length).replace(/^\s+|\s+$/g, '');
                if (lunchLines[i].indexOf("Dessert:") != -1)
                    lunchMenu.dessert = lunchLines[i].substring(lunchLines[i].indexOf("Dessert:") + "Dessert:".length).replace(/^\s+|\s+$/g, '');
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
    
});