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
        
        //get current date
        $scope.today = $scope.dd + ' ' + $scope.mm;
        $scope.today = new Date();
        $scope.dd = $scope.today.getDate();
        $scope.mm = $scope.today.getMonth()+1; //January is 0
        $scope.hh = $scope.today.getHours();

        if($scope.dd<10) {
         $scope.dd='0'+$scope.dd
        } 
        if($scope.mm<10) {
         $scope.mm='0'+$scope.mm
        }
        
        if($scope.hh >= 18 || $scope.hh <=7){
            bridgeDataService.getBridgeSettings().backgroundDayNight = "night";
            bridgeDataService.getBridgeSettings().backgroundClass = "night";
           
        }
        if($scope.hh>=8 && $scope.hh <= 17){
            bridgeDataService.getBridgeSettings().backgroundDayNight = "day";
            
        }

        //get location coords via geolocation
        $scope.get_location = function() {
          //check if geolocation is supported
          if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.get_weather);
            $scope.support = true;
          } else {
          	$scope.support = false;
          }
        };

        //get the json data with specific coords
         $scope.get_weather = function(position) {
          $scope.latitude = position.coords.latitude;
          $scope.longitude = position.coords.longitude;

          $scope.weatherData = '/api/get?proxy=true&url=' + encodeURIComponent('http://api.openweathermap.org:80/data/2.5/weather?lat=' + $scope.latitude + '&lon=' + $scope.longitude);
          $scope.forecastData ='/api/get?proxy=true&url=' + encodeURIComponent('http://api.openweathermap.org:80/data/2.5/forecast/daily?lat='+$scope.latitude+'&lon='+$scope.longitude+'&cnt=4&mode=json');

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
            	bridgeDataService.getBridgeSettings().backgroundClass = "smallClouds";
            } 
            if (weatherData.clouds.all >= 41){
            	bridgeDataService.getBridgeSettings().backgroundClass = "bigClouds";
            } 
            //console.log($scope.clouds);

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
                	bridgeDataService.getBridgeSettings().backgroundClass = "rain";
                }            
            }
            

          });
   
        $http.get($scope.forecastData).success(function (forecastData) {
            //next days
            $scope.forecastDays = [];

            function maximalPossibleEntries(list, maxItems) {
                return list.length > maxItems ? maxItems : list.length;
            };

            for(var i = 0; i <= maximalPossibleEntries(forecastData.list, 4); i++){
                $scope.forecastDays[i] = {
                    temperatureMin: forecastData.list[i].temp.min.toFixed(0) - 273,
                    temperatureMax: forecastData.list[i].temp.max.toFixed(0) - 273,
                    weatherDes: forecastData.list[i].weather[0].description,
                    weatherIco: forecastData.list[i].weather[0].icon
                    
                };

            };
/*
            $scope.forecast_temperature_1_min = forecastData.list[0].temp.min.toFixed(0) - 273;
            $scope.forecast_temperature_1_max = forecastData.list[0].temp.max.toFixed(0) - 273;
            $scope.forecast_temperature_1_des = forecastData.list[0].weather[0].description;
            $scope.forecast_temperature_1_ico = forecastData.list[0].weather[0].icon;
            //console.log($scope.forecast_temperature_1);

            $scope.forecast_temperature_2_min = forecastData.list[1].temp.min.toFixed(0) - 273;
            $scope.forecast_temperature_2_max = forecastData.list[1].temp.max.toFixed(0) - 273;
            $scope.forecast_temperature_2_des = forecastData.list[1].weather[0].description;
            $scope.forecast_temperature_2_ico = forecastData.list[1].weather[0].icon;
            //console.log($scope.forecast_temperature_2);

            $scope.forecast_temperature_3_min = forecastData.list[2].temp.min.toFixed(0) - 273;
            $scope.forecast_temperature_3_max = forecastData.list[2].temp.max.toFixed(0) - 273;
            $scope.forecast_temperature_3_des = forecastData.list[2].weather[0].description;
            $scope.forecast_temperature_3_ico = forecastData.list[2].weather[0].icon;
            //console.log($scope.forecast_temperature_3);

            $scope.forecast_temperature_4_min = forecastData.list[3].temp.min.toFixed(0) - 273;
            $scope.forecast_temperature_4_max = forecastData.list[3].temp.max.toFixed(0) - 273;
            $scope.forecast_temperature_4_des = forecastData.list[3].weather[0].description;
            $scope.forecast_temperature_4_ico = forecastData.list[3].weather[0].icon;
            //console.log($scope.forecast_temperature_4);*/
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



   

            

  
