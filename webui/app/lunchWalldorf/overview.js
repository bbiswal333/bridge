angular.
  module('app.lunchWalldorf', ["lib.utils"]).
  directive('app.lunchWalldorf', ["lib.utils.calUtils", "app.lunchWalldorf.dataProcessor", function (calUtils, dataProcessor) {
    var directiveController = ['$scope', '$http', function ($scope, $http) {
        
        $scope.boxTitle = "Lunch Wdf / Rot";
        $scope.boxIcon = '&#xe824;';
        $scope.boxIconClass = 'icon-meal';
        $scope.boxSize = "1";
        $scope.contentLoaded = false;
        $scope.customCSSFile = "app/lunchWalldorf/style.css";
        $scope.portalLink = "https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.wcms.Cockpit.Main?url=/guid/3021bb0d-ed8d-2910-5aa6-cbed615328df";        
    
        $scope.portalLinkText = "Lunch menu in the portal";
        $scope.noDataString = "Data could not be loaded from webservice.";

        // proceed to next potential lunch-relevant day
        var date = dataProcessor.getDateToDisplay(new Date());
        while (!dataProcessor.isRegularWeekDay(date)) {
            date.setDate( date.getDate() + 1 );
        }    

        $http.get('/api/get?proxy=true&url=' + encodeURI('http://app.sap.eurest.de:80/mobileajax/data/35785f54c4f0fddea47b6d553e41e987/all.json')
        ).success(function(data) {            
            // evaluate menu
            $scope.lunch = dataProcessor.getLunchMenu(data, date);
            if($scope.lunch){
                $scope.date = calUtils.getWeekdays()[dataProcessor.getDay(date)].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
                $scope.contentLoaded = true;                
            } else {
                // move on to next date
                date.setDate( date.getDate() + 1 );
                while (!dataProcessor.isRegularWeekDay(date)) {
                    date.setDate( date.getDate() + 1 );
                }
                // evaluate menu
                $scope.lunch = dataProcessor.getLunchMenu(data, date);
                if($scope.lunch){
                    $scope.date = calUtils.getWeekdays()[dataProcessor.getDay(date)].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
                    $scope.contentLoaded = true;                    
                } else {
                    $scope.contentLoaded = false;                    
                }
            }
        }).error(function() {            
        });
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/lunchWalldorf/overview.html',
        controller: directiveController
        };
}]);

angular.module("app.lunchWalldorf").service('app.lunchWalldorf.dataProcessor', function(){
    var Monday = 1;
    var Friday = 5;
    var TimeAfterWhichToDisplayNextDay = 14;

    this.getDateToDisplay = function (date) {
        if (date.getDay()   >= Monday &&
            date.getDay()   <  Friday &&
            date.getHours() >= TimeAfterWhichToDisplayNextDay ){
            date.setDate( date.getDate() + 1 );
        }
        return date;
    };

    this.isRegularWeekDay = function(date) {
        if (date.getDay() > Friday ||
            date.getDay() < Monday){
            return false;
        }else{
            return true;
        }
    };

    this.getDay = function (date) {
        if (date.getDay() < Monday){
            return 6;
        }else{
            return date.getDay() - 1;
        }
    };

    this.getLunchMenu = function (data, date) 
    {                                
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);        
        date = Math.floor(date.getTime() / 1000);        

        for(var i = 0; i < data.menu.length; i++)
        {                    
            var diff = ((data.menu[i].date - date) / 60 / 60);              

            if(diff === 0)
            {
                var lunchMenu = {};
                var date_menu = data.menu[i].counters;

                for(var j = 0; j < date_menu.length; j++)
                {
                    if(date_menu[j].title.en === "Soup")
                    {
                        lunchMenu.soup = date_menu[j].dishes[0].title.de;
                    }
                    else if(date_menu[j].title.en === "Side dish")
                    {
                        lunchMenu.sideDishes = date_menu[j].dishes[0].title.de;
                    }
                    else if(date_menu[j].title.en === "Dessert")
                    {
                        lunchMenu.dessert = date_menu[j].dishes[0].title.de;
                    }
                    else
                    {
                        if(!lunchMenu.mainCourse)
                        {
                            lunchMenu.mainCourse = [];
                        }
                        lunchMenu.mainCourse.push( date_menu[j].dishes[0].title.de );   
                    }

                }
                return lunchMenu;
            }
        }
    };
});