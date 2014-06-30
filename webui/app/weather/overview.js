angular.module('app.weather', ["lib.utils"]);
angular.module('app.weather').directive('app.weather', function () {

    var directiveController = ['$scope', '$http', 'bridgeDataService', 'lib.utils.calUtils', function ($scope, $http, bridgeDataService, calUtils) 
    {
    	$scope.box.boxSize = "1"; 


        /*$scope.box.settingScreenData = {
            templatePath: "weather/settings.html",
            controller: angular.module('app.weather').appWeatherSettings,
        }; */

        $scope.getCurrentDate = function (days)
        {
            var date = new Date();
            return calUtils.getWeekdays()[(date.getDay() - 1 + days) % 7].medium;
        };
        
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
            bridgeDataService.getTemporaryData().backgroundDayNight = "night";
            bridgeDataService.getTemporaryData().backgroundClass = "night";
           
        }
        if ($scope.hh >= 8 && $scope.hh <= 17 ){
            bridgeDataService.getTemporaryData().backgroundDayNight = "day";
            
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

          var weatherDataURL = '/api/get?proxy=true&url=' + encodeURIComponent('http://api.openweathermap.org:80/data/2.5/weather?lat=' + $scope.latitude + '&lon=' + $scope.longitude);
          var forecastDataURL = '/api/get?proxy=true&url=' + encodeURIComponent('http://api.openweathermap.org:80/data/2.5/forecast/daily?lat=' + $scope.latitude + '&lon=' + $scope.longitude + '&cnt=4&mode=json');

          $http.get(weatherDataURL).success(function (weatherDataJSON) {
            
            $scope.fahrenheit = false;
            if($scope.fahrenheit){
                $scope.temperature = weatherDataJSON.main.temp.toFixed(0);
            }
            if(!$scope.fahrenheit){
                $scope.temperature = weatherDataJSON.main.temp.toFixed(0) - 273;
            }

            var weatherData = parseWeatherData(weatherDataJSON.rain, weatherDataJSON.clouds.all);
            bridgeDataService.getTemporaryData().backgroundClass = weatherData.backgroundClass;
            
            $scope.city = weatherDataJSON.name; 
            $scope.city_id = weatherDataJSON.id;

            $scope.des = weatherData.description;
            
             

          });
   
          function checkWeatherConditionClouds (clouds){
            if(clouds != undefined){
                if (clouds == 0){
                    return "sun";
                }
                if (clouds >= 1 && clouds <= 40){
                    return "smallClouds";
                }
                if (clouds >= 41){
                    return "bigClouds";
                }
            }
            else {
                return null;
            }
            
          }
          function checkWeatherConditionRain(rain){
            if(rain != undefined) {            
                if (rain['3h'] > 0){
                    return  "rain";
                }
                else {
                    return null;
                }            
            }
            else {
                    return null;
                } 
          }

          function parseWeatherData(rain,clouds){
            var weatherData = {
                rain: checkWeatherConditionRain(rain),
                clouds: checkWeatherConditionClouds(clouds)
            };
            if((weatherData.clouds == null || weatherData.clouds == "sun")
                && weatherData.rain == null){
                weatherData.description = 'sunny';
                weatherData.backgroundClass = 'sun';
                weatherData.icon = 'wi wi-day-sunny';
            };
            if(weatherData.clouds == "smallClouds" && weatherData.rain == null){
                weatherData.description = 'sunny with clouds';
                weatherData.backgroundClass = 'smallClouds';
                weatherData.icon = 'wi wi-day-cloudy';
            };
            if(weatherData.clouds == "bigClouds" && weatherData.rain == null){
                weatherData.description = 'cloudy';
                weatherData.backgroundClass = 'bigClouds';
                weatherData.icon = 'wi wi-cloudy';
            };
            if(weatherData.rain != null){
                weatherData.description = 'rainy';
                weatherData.backgroundClass = 'rain';
                weatherData.icon = 'wi wi-rain';
            };
            return weatherData;
           }

        $http.get(forecastDataURL).success(function (forecastData) {
            //next days
            $scope.forecastDays = [];

            function maximalPossibleEntries(list, maxItems) {
                return list.length > maxItems ? maxItems : list.length;
            }

            for(var i = 0; i <= maximalPossibleEntries(forecastData.list, 3); i++){
                var weatherData = parseWeatherData(forecastData.list[i].rain,forecastData.list[i].clouds);
                $scope.forecastDays[i] = {
                    temperatureMin: forecastData.list[i].temp.min.toFixed(0) - 273,
                    temperatureMax: forecastData.list[i].temp.max.toFixed(0) - 273,
                    rain: weatherData.rain,
                    clouds: weatherData.clouds,
                    weatherIco : weatherData.icon
                };            
               //console.log($scope.forecastDays[i].weatherIco+' '+$scope.forecastDays[i].clouds);
                
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



   

            

  
