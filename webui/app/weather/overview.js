angular.module('app.weather', ["lib.utils"]);
angular.module('app.weather').directive('app.weather', ['app.weather.configservice',function (weatherconfig) {

    var directiveController = ['$scope', '$http', '$interval', 'bridgeDataService', 'lib.utils.calUtils', function ($scope, $http, $interval, bridgeDataService, calUtils) 
    {
    	$scope.box.boxSize = "1"; 
        $scope.box.settingsTitle = "Configure temparature scale and location";
        $scope.box.settingScreenData = {
            templatePath: "weather/settings.html",
            controller: angular.module('app.weather').appWeatherSettings
        };

        $scope.configService = weatherconfig;
        $scope.box.returnConfig = function(){
            return angular.copy($scope.configService);
        };

        function loadData() {
            if($scope.configService.configItem.location !== undefined && $scope.configService.configItem.location.name !== undefined)
            {
                $scope.city_name = $scope.configService.configItem.location.name;
                $scope.fahrenheit = $scope.configService.configItem.fahrenheit;
                $scope.setPosition($scope.configService.configItem.location);
                $scope.getWeather();
                $scope.getForcast();
            }
        }

        $scope.$watch('configService', function () 
        {
            loadData();
        }, true);
        $interval(loadData, 1000 * 60 * 5);

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

        function checkWeatherConditionClouds (clouds){
            if(clouds !== undefined){
                if (clouds === 0){
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
            if(rain !== undefined) {            
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
            if((weatherData.clouds === null || weatherData.clouds === "sun")
                && weatherData.rain == null){
                weatherData.description = 'sunny';
                weatherData.backgroundClass = 'sun';
                weatherData.icon = 'wi wi-day-sunny';
            }
            if(weatherData.clouds === "smallClouds" && weatherData.rain === null){
                weatherData.description = 'sunny with clouds';
                weatherData.backgroundClass = 'smallClouds';
                weatherData.icon = 'wi wi-day-cloudy';
            }
            if(weatherData.clouds === "bigClouds" && weatherData.rain === null){
                weatherData.description = 'cloudy';
                weatherData.backgroundClass = 'bigClouds';
                weatherData.icon = 'wi wi-cloudy';
            }
            if(weatherData.rain != null){
                weatherData.description = 'rainy';
                weatherData.backgroundClass = 'rain';
                weatherData.icon = 'wi wi-rain';
            }
            return weatherData;
        }

        $scope.setPosition = function(position) {
            $scope.latitude = position.latitude;
            $scope.longitude = position.longitude;
        };

        $scope.getWeather = function() {

            var weatherDataURL = 'http://api.openweathermap.org:80/data/2.5/weather?lat=' + $scope.latitude + '&lon=' + $scope.longitude;
            weatherDataURL = '/api/get?proxy=true&url=' + encodeURIComponent(weatherDataURL);

            $http.get(weatherDataURL).success(function (weatherDataJSON) {
                        
            if($scope.fahrenheit){
                $scope.temperature = (((weatherDataJSON.main.temp - 273)  * 1.8) + 32).toFixed(0);
            }
            if(!$scope.fahrenheit){
                $scope.temperature = (weatherDataJSON.main.temp - 273).toFixed(0);
            }

            var weatherData = parseWeatherData(weatherDataJSON.rain, weatherDataJSON.clouds.all);
            bridgeDataService.getTemporaryData().backgroundClass = weatherData.backgroundClass;

            $scope.city = weatherDataJSON.name; 
            $scope.city_id = weatherDataJSON.id;

            $scope.des = weatherData.description;
        });

        $scope.getForcast = function() {

            var forecastDataURL = 'http://api.openweathermap.org:80/data/2.5/forecast/daily?lat=' + $scope.latitude + '&lon=' + $scope.longitude + '&cnt=5&mode=json';
            forecastDataURL = '/api/get?proxy=true&url=' + encodeURIComponent(forecastDataURL);

            $http.get(forecastDataURL).success(function (forecastData) {
                forecastData.list.splice(0,1); // remove today
                //next days
                $scope.forecastDays = [];

                function maximalPossibleEntries(list, maxItems) {
                    return list.length > maxItems ? maxItems : list.length;
                }

                for(var i = 0; i <= maximalPossibleEntries(forecastData.list, 3); i++){
                    var weatherData = parseWeatherData(forecastData.list[i].rain,forecastData.list[i].clouds);

                    if($scope.fahrenheit)
                    {
                        $scope.forecastDays[i] = {
                            temperatureMin: (((forecastData.list[i].temp.min - 273)  * 1.8) + 32).toFixed(0),
                            temperatureMax: (((forecastData.list[i].temp.max - 273)  * 1.8) + 32).toFixed(0),
                            rain: weatherData.rain,
                            clouds: weatherData.clouds,
                            weatherIco : weatherData.icon
                        };
                    }

                    if(!$scope.fahrenheit){
                        $scope.forecastDays[i] = {
                            temperatureMin: (forecastData.list[i].temp.min - 273).toFixed(0),
                            temperatureMax: (forecastData.list[i].temp.max - 273).toFixed(0),
                            rain: weatherData.rain,
                            clouds: weatherData.clouds,
                            weatherIco : weatherData.icon
                        };     
                    }
                }
            });
        };
    };
    //start whole weathermagic
    //$scope.get_location();
}];

return {
    restrict: 'E',
    templateUrl: 'app/weather/overview.html',
    controller: directiveController,
    link: function ($scope) 
        {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) 
            {
                weatherconfig.configItem = $scope.appConfig.configItem;
            }
        }
    };
}]);