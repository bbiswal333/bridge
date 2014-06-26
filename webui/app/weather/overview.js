angular.module('app.weather', ["lib.utils"]);
angular.module('app.weather').directive('app.weather', function () {

    var directiveController = ['$scope', '$http', 'bridgeDataService', 'lib.utils.calUtils', function ($scope, $http, bridgeDataService, calUtils) 
    {
    	$scope.box.boxSize = "1"; 

        $scope.getCurrentDate = function (days)
        {
            var date = new Date();
            return calUtils.getWeekdays()[(date.getDay() - 1 + days) % 7].medium;
        };

        //set stuff locally
        if(!bridgeDataService.getBridgeSettings().local)
        {
            bridgeDataService.getBridgeSettings().local = {};
        }
        
        //get current date
        $scope.today = $scope.dd + ' ' + $scope.mm;
        $scope.today = new Date();
        $scope.dd = $scope.today.getDate();
        $scope.mm = $scope.today.getMonth() + 1; //January is 0
        $scope.hh = $scope.today.getHours();

        if ($scope.dd < 10) 
        {
            $scope.dd = '0' + $scope.dd;
        } 

        if ($scope.mm < 10) 
        {
            $scope.mm = '0' + $scope.mm;
        }
        
        if ($scope.hh >= 18 || $scope.hh <= 7){
            bridgeDataService.getBridgeSettings().local.backgroundDayNight = "night";
            bridgeDataService.getBridgeSettings().local.backgroundClass = "night";
           
        }
        if ($scope.hh >= 8 && $scope.hh <= 17 ){
            bridgeDataService.getBridgeSettings().local.backgroundDayNight = "day";
            
        }

        //get location coords via geolocation
        $scope.get_location = function()
        {
          //check if geolocation is supported
          $scope.support = false;
          if (Modernizr.geolocation) 
          {
            navigator.geolocation.getCurrentPosition($scope.get_weather, $scope.location_error);
          }
        };

        $scope.location_error = function()
        {
            $scope.support = false;
        };

        //get the json data with specific coords
         $scope.get_weather = function(position) {
          $scope.latitude = position.coords.latitude;
          $scope.longitude = position.coords.longitude;
          $scope.support = true;

          $scope.weatherData = '/api/get?proxy=true&url=' + encodeURIComponent('http://api.openweathermap.org:80/data/2.5/weather?lat=' + $scope.latitude + '&lon=' + $scope.longitude);
          $scope.forecastData = '/api/get?proxy=true&url=' + encodeURIComponent('http://api.openweathermap.org:80/data/2.5/forecast/daily?lat=' + $scope.latitude + '&lon=' + $scope.longitude + '&cnt=4&mode=json');

          $http.get($scope.weatherData).success(function (weatherData) {
            //ask for clouds, rain, etc
            //temperature in celsius
            $scope.temperature = weatherData.main.temp.toFixed(0) - 273;
            //console.log($scope.temperature);

            //description
            $scope.des = weatherData.weather[0].description;

            //clouds
            $scope.clouds = weatherData.clouds.all;
          
            if (weatherData.clouds.all > 0 && weatherData.clouds.all <= 40){
            	bridgeDataService.getBridgeSettings().local.backgroundClass = "smallClouds";
            } 
            if (weatherData.clouds.all >= 41){
            	bridgeDataService.getBridgeSettings().local.backgroundClass = "bigClouds";
            }             

            //city
            $scope.city = weatherData.name; 
            $scope.city_id = weatherData.id;
            //console.log($scope.city);

            //rain
            $scope.raining = false;
            if(weatherData.rain)
            {            
                $scope.rain = weatherData.rain['3h'];
                if (weatherData.rain['3h'] > 0){
                	bridgeDataService.getBridgeSettings().local.backgroundClass = "rain";
                }            
            }
            

          });
   
        $http.get($scope.forecastData).success(function (forecastData) {
            //next days
            $scope.forecastDays = [];

            function maximalPossibleEntries(list, maxItems) {
                return list.length > maxItems ? maxItems : list.length;
            }        

            for(var i = 0; i <= maximalPossibleEntries(forecastData.list, 3); i++){
                $scope.forecastDays[i] = {
                    temperatureMin: forecastData.list[i].temp.min.toFixed(0) - 273,
                    temperatureMax: forecastData.list[i].temp.max.toFixed(0) - 273,
                    weatherDes: forecastData.list[i].weather[0].description,
                    weatherIco: forecastData.list[i].weather[0].icon   
                };            
               
            }
          });

        

        };

        //start whole weathermagic
        $scope.get_location();          
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/weather/overview.html',
        controller: directiveController
    };
});



   

            

  
