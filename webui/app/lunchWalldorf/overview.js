angular.
  module('app.lunchWalldorf', ["lib.utils"]).
  directive('app.lunchWalldorf', [
    "lib.utils.calUtils",
      "bridgeDataService",
    "app.lunchWalldorf.dataProcessor",
    "app.lunchWalldorf.configservice",
      "app.lunchWalldorf.backendData",
      function (calUtils, bridgeDataService, dataProcessor, lunchConfigService, lunchBackendData) {
    var directiveController = ['$scope', function ($scope) {
        
        
        $scope.boxIcon = '&#xe824;';
        $scope.boxSize = "1";
        $scope.contentLoaded = false;
        $scope.customCSSFile = "app/lunchWalldorf/style.css";

        if (typeof $scope.userInfo == "undefined") {
            $scope.userInfo = {};
        }

        // default to WDF01
        $scope.userInfo.building = "WDF01";
        if (typeof bridgeDataService.getUserInfo() != "undefined") {
            $scope.userInfo.building = bridgeDataService.getUserInfo().BUILDING;
        }

        $scope.box.settingsTitle = "Configure language";
        $scope.box.settingScreenData = {
            templatePath: "lunchWalldorf/settings.html",
                controller: angular.module('app.lunchWalldorf').applunchWalldorfSettings,
                id: $scope.boxId,
                scope: {
                    userInfo: "="
                }
        };
        var self = this;
        
        $scope.noDataString = "Data could not be loaded from webservice.";

        $scope.configService = lunchConfigService;

        // proceed to next potential lunch-relevant day
        var date = dataProcessor.getDateToDisplay(new Date());
        while (!dataProcessor.isRegularWeekDay(date)) {
            date.setDate( date.getDate() + 1 );
        }
        $scope.date = date;

        $scope.box.returnConfig = function(){
            return angular.copy($scope.configService);
        };    

        $scope.chosenbackend = $scope.configService.chosenbackend;

 
        $scope.refreshBackend = function () {
            
            // default back to user building if no Backend selected - if not to WDF
            if ( ! lunchBackendData.isValidBackend( $scope.chosenbackend ) ) {
                $scope.chosenbackend = $scope.userInfo.building.substring(0,3);
                if ( ! lunchBackendData.isValidBackend( $scope.chosenbackend ) ) {
                    $scope.chosenbackend = lunchBackendData.getDefaultBackend();
                }
            }

            lunchBackendData.getLunchData($scope.chosenbackend).then( function (data) {
                $scope.lunch = dataProcessor.getLunchMenu(data, $scope.date);
                if ($scope.lunch) {
                    $scope.screendate = calUtils.getWeekdays()[dataProcessor.getDay($scope.date)].long + ", " + $scope.date.getDate() + ". " + calUtils.getMonthName($scope.date.getMonth()).long;
                    $scope.contentLoaded = true;
                } else {
                    // move on to next date
                    $scope.date.setDate($scope.date.getDate() + 1);
                    while (!dataProcessor.isRegularWeekDay($scope.date)) {
                        $scope.date.setDate($scope.date.getDate() + 1);
                    }
                    // evaluate menu
                    $scope.lunch = dataProcessor.getLunchMenu(data, $scope.date);
                    if ($scope.lunch) {
                        $scope.screendate = calUtils.getWeekdays()[dataProcessor.getDay($scope.date)].long + ", " + $scope.date.getDate() + ". " + calUtils.getMonthName($scope.date.getMonth()).long;
                        $scope.contentLoaded = true;
                    } else {
                        $scope.contentLoaded = false;
                    }
                }
            });
            $scope.portalLink = lunchBackendData.getBackendMetadata().portalLink;
            $scope.portalLinkText = lunchBackendData.getBackendMetadata().portalLinkText;
        };
        
        $scope.refreshBackend($scope.chosenbackend, $scope.date);

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/lunchWalldorf/overview.html',
        controller: directiveController,
        link: function ($scope) 
             {
                if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) 
                 {
                    lunchConfigService.configItem = $scope.appConfig.configItem;
                } else {
                    $scope.appConfig.configItem = lunchConfigService.configItem;
                }
                $scope.box.boxSize = lunchConfigService.configItem.boxSize;
                $scope.chosenbackend = lunchConfigService.configItem.chosenbackend;
                 
                $scope.$watch("appConfig.configItem.boxSize", function () {
                    if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                        $scope.box.boxSize = $scope.appConfig.configItem.boxSize;
                    }
                }, true);
                 $scope.$watch("appConfig.configItem.chosenbackend", function () {
                     if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                         $scope.chosenbackend = lunchConfigService.configItem.chosenbackend;
                         $scope.refreshBackend($scope.chosenbackend, $scope.date);
                     }
                 }, true);
             }
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

    this.getListAsSingleDish = function (dishes) {
        var parsedDishes = {};
        parsedDishes.title = [];

        dishes.forEach(function(dish) {
            if (!parsedDishes.title.en) {
                parsedDishes.title.en = dish.title.en;
            } else {
                parsedDishes.title.en = parsedDishes.title.en + ", " + dish.title.en;
            }
            if (!parsedDishes.title.de) {
                parsedDishes.title.de = dish.title.de;
            } else {
                parsedDishes.title.de = parsedDishes.title.de + ", " + dish.title.de;
            }
        });

        return parsedDishes;
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

            // the KAR backend is a bit out of sync, therefore we need 
            // a bit of tweaking here and can't compare to 0 any more
            if(diff < 10 && diff > -10)
            {
                var lunchMenu = {};
                var date_menu = data.menu[i].counters;

                for(var j = 0; j < date_menu.length; j++)
                {
                    if(date_menu[j].title.en === "Soup")
                    {
                            lunchMenu.soup = date_menu[j].dishes;
                    }
                    else if(date_menu[j].title.en === "Side dish")
                    {
                        lunchMenu.sideDishes = [];
                        lunchMenu.sideDishes.push( this.getListAsSingleDish(date_menu[j].dishes) );
                    }
                    else if(date_menu[j].title.en === "Dessert")
                    {
                        lunchMenu.dessert = [];
                        lunchMenu.dessert.push( this.getListAsSingleDish(date_menu[j].dishes) );
                    }
                    else
                    {
                        if(!lunchMenu.mainCourse)
                        {
                            lunchMenu.mainCourse = [];
                        }
                        lunchMenu.mainCourse.push( date_menu[j].dishes[0] );   
                    }

                }
                return lunchMenu;
            }
        }
    };
});

angular.module("app.lunchWalldorf" ).service('app.lunchWalldorf.backendData', [ "$http", "$q", function($http, $q){
    
    var configBackend = 
        { 
            "WDF": {
                portalLink:  "https://portal.wdf.sap.corp/irj/servlet/prt/portal/prtroot/com.sap.sen.wcms.Cockpit.Main?url=/guid/3021bb0d-ed8d-2910-5aa6-cbed615328df",
                portalLinkText: "Lunch menu in the portal",
    
                portalBackend: '/api/get?proxy=true&url=' +         encodeURI('http://app.sap.eurest.de:80/mobileajax/data/35785f54c4f0fddea47b6d553e41e987/all.json')
            },
            "KAR": {
                portalLink:  "http://www.casinocatering.de/speiseplan/max-rubner-institut",
                portalLinkText: "Lunch menu online",
               // portalBackend: '/api/get?proxy=false&url=' + encodeURI('http://deqkalvm294.qkal.sap.corp:8080/bfe.json')
                portalBackend: 'https://deqkalvm294.qkal.sap.corp/bfe.json'
            }
        };
    this.isValidBackend = function(backend) {
        return typeof configBackend[backend] != "undefined";
    };

    this.getDefaultBackend = function() {
        return configBackend.WDF;   
    };
    
    this.getBackendMetadata = function() {
        
        if (! this.isValidBackend(this.chosenbackend) ) {
            this.getDefaultBackend();
        }
        return configBackend[this.chosenbackend];
    };
        
    this.getLunchData = function(chosenbackend) {
        var deferred = $q.defer();
        
        this.chosenbackend = chosenbackend;
        
        if (! this.isValidBackend(chosenbackend)) {
            this.getDefaultBackend();
        }
        
        $http.get(configBackend[this.chosenbackend].portalBackend).then(function (data) {
            if (data.status != 200 && data.status != 304 ) {
                deferred.reject(data);
            } else {
                deferred.resolve(data.data);
            } 
        }); 
        
        return deferred.promise;
    };


}]);
