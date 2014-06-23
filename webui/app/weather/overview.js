﻿angular.module('app.weather', []);
angular.module('app.weather').directive('app.weather', function () {

    var directiveController = ['$scope', function ($scope) 
    {
    	$scope.box.boxSize = "1"; 

        //$scope.box.settingScreenData = {
        //    templatePath: "weather/settings.html",
        //    controller: angular.module('app.weather').appWeatherSettings,
        //    };
        
        //get current date
        $scope.today = $scope.dd + ' ' + $scope.mm;
        $scope.today = new Date();
        $scope.dd = $scope.today.getDate();
        $scope.mm = $scope.today.getMonth()+1; //January is 0

        if($scope.dd<10) {
         $scope.dd='0'+$scope.dd
        } 
        if($scope.mm<10) {
         $scope.mm='0'+$scope.mm
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
        }
        //get the json data with specific coords
         $scope.get_weather = function(position) {
          $scope.latitude = position.coords.latitude;
          $scope.longitude = position.coords.longitude;
          $scope.weatherData =  'http://api.openweathermap.org/data/2.5/weather?lat='+$scope.latitude+'&lon='+$scope.longitude;
          $scope.forecastData = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+$scope.latitude+'&lon='+$scope.longitude+'&cnt=4&mode=json';

          $.getJSON($scope.weatherData, function(weatherData) {
            //ask for clouds, rain, etc
            //temperature in celsius
            $scope.temperature = weatherData.main.temp.toFixed(0) - 273;
            console.log($scope.temperature);

            //clouds
            $scope.clouds = weatherData.clouds.all;
            if(weatherData.clouds.all == 0){
				$scope.noClouds = true;
				$scope.bigClouds = false;
				$scope.smallClouds = false;
			}
            if (weatherData.clouds.all > 0 && weatherData.clouds.all <= 40){
            	$scope.smallClouds = true;
            	$scope.bigClouds = false;
            	$scope.noClouds = false;
            } 
            if (weatherData.clouds.all >= 41){
            	$scope.bigClouds = true;
            	$scope.smallClouds = false;
            	$scope.noClouds = false;
            } 
            console.log($scope.clouds);

            //city
            $scope.city = weatherData.name; 
            console.log($scope.city);

            //rain
            $scope.rain = weatherData.rain['3h'];
            if (weatherData.rain['3h'] > 0){
            	$scope.raining = true;
            }
            if(weatherData.rain['3h'] <= 0){
            	$scope.raining = false;
            }
            console.log($scope.rain);

          });
        $.getJSON($scope.forecastData, function(forecastData) {
            //next days
            $scope.forecast_temperature_1 = forecastData.list[0].temp.day.toFixed(0) - 273;
            console.log($scope.forecast_temperature_1);

            $scope.forecast_temperature_2 = forecastData.list[1].temp.day.toFixed(0) - 273;
            console.log($scope.forecast_temperature_2);

            $scope.forecast_temperature_3 = forecastData.list[2].temp.day.toFixed(0) - 273;
            console.log($scope.forecast_temperature_3);

            $scope.forecast_temperature_4 = forecastData.list[3].temp.day.toFixed(0) - 273;
            console.log($scope.forecast_temperature_4);
          });

        }
        //start whole weathermagic
        $scope.get_location();          
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/weather/overview.html',
        controller: directiveController
    };
});



   

            

  
