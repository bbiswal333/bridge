angular.module('app.weather', []);
angular.module('app.weather').directive('app.weather', function () {

    var directiveController = ['$scope', '$http', 'bridgeDataService', function ($scope, $http, bridgeDataService) 
    {
    	$scope.box.boxSize = "1"; 

        
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

        if($scope.hh<=8 && $scope.hh >= 20){
            bridgeDataService.getBridgeSettings().backgroundDayNight = "night";
        }
        if($scope.hh>=7 && $scope.hh <= 19){
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

            //clouds
            $scope.clouds = weatherData.clouds.all;
            if(weatherData.clouds.all === 0){
				bridgeDataService.getBridgeSettings().backgroundClass = "sun";
			}
            if (weatherData.clouds.all > 0 && weatherData.clouds.all <= 40){
            	bridgeDataService.getBridgeSettings().backgroundClass = "smallClouds";
            } 
            if (weatherData.clouds.all >= 41){
            	bridgeDataService.getBridgeSettings().backgroundClass = "bigClouds";
            } 
            //console.log($scope.clouds);

            //city
            $scope.city = weatherData.name; 
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
            $scope.forecast_temperature_1 = forecastData.list[0].temp.day.toFixed(0) - 273;
            //console.log($scope.forecast_temperature_1);

            $scope.forecast_temperature_2 = forecastData.list[1].temp.day.toFixed(0) - 273;
            //console.log($scope.forecast_temperature_2);

            $scope.forecast_temperature_3 = forecastData.list[2].temp.day.toFixed(0) - 273;
            //console.log($scope.forecast_temperature_3);

            $scope.forecast_temperature_4 = forecastData.list[3].temp.day.toFixed(0) - 273;
            //console.log($scope.forecast_temperature_4);
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



   

            

  
