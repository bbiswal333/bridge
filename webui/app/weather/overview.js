angular.module('app.weather', []);
angular.module('app.weather').directive('app.weather', function () {

    var directiveController = ['$scope', function ($scope) 
    {
    	$scope.box.boxSize = "1"; 
        
        //weatherMAGIC
        //get location coords via geolocation
        $scope.get_location = function() {
          //check if geolocation is supported
          if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.show_map);
            $scope.support = true;
          } else {
          	$scope.support = false;
          }
        };
        //get the json data with specific coords
         $scope.show_map = function(position) {
          $scope.latitude = position.coords.latitude;
          $scope.longitude = position.coords.longitude;
          $scope.weatherData = '/api/get?proxy=true&url=' + encodeURIComponent('http://api.openweathermap.org:80/data/2.5/weather?lat=' + $scope.latitude + '&lon=' + $scope.longitude);

          $.getJSON($scope.weatherData, function(weatherData) {
            //ask for clouds, rain, etc
            //temperature in celsius
            $scope.temperature = weatherData.main.temp.toFixed(0) - 273;
            console.log($scope.temperature);

            //clouds
            $scope.clouds = weatherData.clouds.all;
            if(weatherData.clouds.all === 0){
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



   

            

  
