angular.
  module('app.lunchWalldorf', ["lib.utils"]).
  directive('app.lunchWalldorf', ["$timeout", "lib.utils.calUtils", "app.lunchWalldorf.dateHandling", function ($timeout, calUtils, dateHandling) {
    var directiveController = ['$scope', '$http', function ($scope, $http) {
        
        $scope.boxTitle = "Lunch Walldorf/ Rot";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe0d5;';
        $scope.loading = true;
        $scope.customCSSFile = "app/lunchWalldorf/style.css";
        $scope.portalLink = "https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.wcms.Cockpit.Main?url=/guid/3021bb0d-ed8d-2910-5aa6-cbed615328df";

        // ToDo: here needs to be an access to the settings...
        var lang = "de";

        if( lang == "de") {
            var soup_text = "Suppe:";
            var main_text = "Hauptgericht:";
            var alt_text = "Oder:";
            var side_text = "Beilagen:";
            var dessert_text = "Dessert:";
            $scope.portalLinkText = "Lunch Menu im Portal";
            $scope.sorryString = "Sorry, diese Woche gibt's kein Mittagessen mehr.";
        } else {
            lang = "en";
            soup_text = "Soup:";   
            main_text = "Main course:";
            alt_text = "Or:";
            side_text = "Side dishes:";
            dessert_text = "Dessert:";
            $scope.portalLinkText = "Lunch menu in the portal";
            $scope.sorryString = "Sorry, no more lunch this week.";
        };

        var date = dateHandling.getDateToDisplay(new Date());
        $scope.date = calUtils.getWeekdays()[dateHandling.getDay(date)].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
        $scope.dateHasLunchMenu = dateHandling.getValidDateFlag(new Date());

        if ($scope.dateHasLunchMenu && true){
            $http.get('/api/get?url=' + encodeURI('http://155.56.69.85:1081/lunch_' + lang + '.txt') + '&decode=win1252'
            ).success(function(data, status, headers, config) {            

                var lunchMenu = {};
                var lunchstring = data.split('************')[date.getDay() - 1];
                var lunchLines = lunchstring.split("\n");
                var previousLineCategory;

                for(var i = 0; i < lunchLines.length; i++) {
                    if (lunchLines[i].indexOf(soup_text) != -1) {
                        lunchMenu.soup = lunchLines[i].substring(lunchLines[i].indexOf(soup_text) + soup_text.length).replace(/^\s+|\s+$/g, '');
                        previousLineCategory = "soup";
                    }
                    else if (lunchLines[i].indexOf(main_text) != -1) {
                        lunchMenu.mainCourse = [];
                        lunchMenu.mainCourse.push(lunchLines[i].substring(lunchLines[i].indexOf(main_text) + main_text.length).replace(/^\s+|\s+$/g, ''));
                        previousLineCategory = "mainCourse";
                    }
                    else if (lunchLines[i].indexOf(alt_text) != -1) {
                        lunchMenu.mainCourse.push(lunchLines[i].substring(lunchLines[i].indexOf(alt_text) + alt_text.length).replace(/^\s+|\s+$/g, ''));
                        previousLineCategory = "mainCourse";
                    }
                    else if (lunchLines[i].indexOf(side_text) != -1) {
                        lunchMenu.sideDishes = lunchLines[i].substring(lunchLines[i].indexOf(side_text) + side_text.length).replace(/^\s+|\s+$/g, '');
                        previousLineCategory = "sideDish";
                    }
                    else if (lunchLines[i].indexOf(dessert_text) != -1) {
                        lunchMenu.dessert = lunchLines[i].substring(lunchLines[i].indexOf(dessert_text) + dessert_text.length).replace(/^\s+|\s+$/g, '');
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
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        }
        $scope.loading = false;
        $timeout(function () { $scope.$broadcast('recalculateMBScrollbars'); }, 250);
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/lunchWalldorf/overview.html',
        controller: directiveController
        };
}]);

angular.
  module("app.lunchWalldorf").
  service('app.lunchWalldorf.dateHandling', function(){
    var Monday = 1;
    var Friday = 5;
    var TimeAfterWhichToDisplayNextDay = 14;

    this.getDateToDisplay = function (date) {
        if (date.getDay()   >= Monday &&
            date.getDay()   <  Friday &&
            date.getHours() >= TimeAfterWhichToDisplayNextDay ){
            date.setDate( date.getDate() + 1 )
        };
        return date;
    };

    this.getValidDateFlag = function(date) {
        if ((date.getDay() == Friday && date.getHours() >= TimeAfterWhichToDisplayNextDay ) || 
            (date.getDay() > Friday) ||
            (date.getDay() < Monday)){
            return false;
        }else{
            return true;
        };
    };

    this.getDay = function (date) {
        if (date.getDay() < Monday){
            return 6;
        }else{
            return date.getDay() - 1;
        };
    };
});