angular.
  module('app.lunchWalldorf', ["lib.utils"]).
  directive('app.lunchWalldorf', ["$timeout", "lib.utils.calUtils", "app.lunchWalldorf.dataProcessor", "bridgeCounter", function ($timeout, calUtils, dataProcessor, bridgeCounter) {
    var directiveController = ['$scope', '$http', function ($scope, $http) {
        
        $scope.boxTitle = "Lunch Walldorf/ Rot";
        $scope.boxIcon = '&#xe824;';
        $scope.boxIconClass = 'icon-meal';
        $scope.boxSize = "1";
        $scope.contentLoaded = false;
        $scope.customCSSFile = "app/lunchWalldorf/style.css";
        $scope.portalLink = "https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.wcms.Cockpit.Main?url=/guid/3021bb0d-ed8d-2910-5aa6-cbed615328df";
        bridgeCounter.CollectWebStats('LUNCH_WALLDORF', 'APPLOAD');

        var lang = "de";
        // English texts standard for now...
        $scope.portalLinkText = "Lunch menu in the portal";
        $scope.noDataString = "Data could not be loaded from webservice.";

        // Proceed to next potential lunch-relevant day
        var date = dataProcessor.getDateToDisplay(new Date());
        while (!dataProcessor.isRegularWeekDay(date)) {
            date.setDate( date.getDate() + 1 );
        };

        $http.get('/api/get?url=' + encodeURI('http://155.56.69.85:1081/lunch_' + lang + '.txt') + '&decode=win1252'
        ).success(function(data) {
            // evaluate menu
            $scope.lunch = dataProcessor.getLunchMenu(data, date, lang);
            if($scope.lunch){
                $scope.date = calUtils.getWeekdays()[dataProcessor.getDay(date)].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
                $scope.contentLoaded = true;
                bridgeCounter.CollectWebStats('LUNCH_WALLDORF', 'SUCCESS_GET_DATA');
            } else {
                // move on to next date
                date.setDate( date.getDate() + 1 );
                while (!dataProcessor.isRegularWeekDay(date)) {
                    date.setDate( date.getDate() + 1 );
                };
                // evaluate menu
                $scope.lunch = dataProcessor.getLunchMenu(data, date, lang);
                if($scope.lunch){
                    $scope.date = calUtils.getWeekdays()[dataProcessor.getDay(date)].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
                    $scope.contentLoaded = true;
                    bridgeCounter.CollectWebStats('LUNCH_WALLDORF', 'SUCCESS_GET_DATA');
                } else {
                    $scope.contentLoaded = false;
                    bridgeCounter.CollectWebStats('LUNCH_WALLDORF', 'ERROR_GET_DATA');
                };
            };
        }).error(function() {
            bridgeCounter.CollectWebStats('LUNCH_WALLDORF', 'ERROR_GET_DATA');
        });
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/lunchWalldorf/overview.html',
        controller: directiveController
        };
}]);

angular.
  module("app.lunchWalldorf").
  service('app.lunchWalldorf.dataProcessor', function(){
    var Monday = 1;
    var Friday = 5;
    var TimeAfterWhichToDisplayNextDay = 14;

    this.getDateToDisplay = function (date) {
        if (date.getDay()   >= Monday &&
            date.getDay()   <  Friday &&
            date.getHours() >= TimeAfterWhichToDisplayNextDay ){
            date.setDate( date.getDate() + 1 );
        };
        return date;
    };

    this.isRegularWeekDay = function(date) {
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

    this.getLunchMenu = function (data, date, lang) {
        if( lang == "de") {
            var soup_text = "Suppe:";
            var main_text = "Hauptgericht:";
            var alt_text = "Oder:";
            var side_text = "Beilagen:";
            var dessert_text = "Dessert:";
        } else {
            lang = "en";
            soup_text = "Soup:";   
            main_text = "Main course:";
            alt_text = "Or:";
            side_text = "Side dishes:";
            dessert_text = "Dessert:";
        };

        var lunchMenu = {};
        var lunchstring = data.split('************')[date.getDay() - 1];
        var lunchLines = lunchstring.split("\n");
        var previousLineCategory;
        var dateValidated = false;

        for(var i = 0; i < lunchLines.length; i++) {
            if (lunchLines[i].indexOf(date.getUTCDate()) != -1) {
                dateValidated = true;
            };
        };

        if (!dateValidated) {
            return;
        };

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
        return lunchMenu;
    };
});