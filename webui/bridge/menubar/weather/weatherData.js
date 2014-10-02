angular.module("bridge.app").service("bridge.menubar.weather.weatherData", ["bridge.menubar.weather.configservice", "lib.utils.calUtils", "bridgeDataService", "$http", "$interval", function(weatherConfig, calUtils, bridgeDataService, $http, $interval) {
    var data = {};

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

    function setPosition(position) {
        data.latitude = position.latitude;
        data.longitude = position.longitude;
    }

    // function getCurrentDate(days)
    // {
    //     var date = new Date();
    //     var dayInWeek = (date.getDay() - 1 + days);
    //     if (dayInWeek === -1) { // Sunday
    //         dayInWeek = 6;
    //     }
    //     return calUtils.getWeekdays()[dayInWeek % 7].medium;
    // }


    function getWeather(targetObject) {

        var weatherDataURL = 'http://api.openweathermap.org:80/data/2.5/weather?lat=' + targetObject.latitude + '&lon=' + targetObject.longitude;
        weatherDataURL = '/api/get?proxy=true&url=' + encodeURIComponent(weatherDataURL);

        $http.get(weatherDataURL).success(function (weatherDataJSON) {

            if(data.fahrenheit){
                targetObject.temperature = (((weatherDataJSON.main.temp - 273)  * 1.8) + 32).toFixed(0);
            }
            if(!data.fahrenheit){
                targetObject.temperature = (weatherDataJSON.main.temp - 273).toFixed(0);
            }

            var weatherData = parseWeatherData(weatherDataJSON.rain, weatherDataJSON.clouds.all);
            bridgeDataService.getTemporaryData().backgroundClass = weatherData.backgroundClass;

            targetObject.city = weatherDataJSON.name;
            targetObject.city_id = weatherDataJSON.id;

            targetObject.description = weatherData.description;
            targetObject.weatherIcon = weatherData.icon;
        });
    }
    this.getWeather = getWeather;

    function getForcast() {

        var forecastDataURL = 'http://api.openweathermap.org:80/data/2.5/forecast/daily?lat=' + data.latitude + '&lon=' + data.longitude + '&cnt=5&mode=json';
        forecastDataURL = '/api/get?proxy=true&url=' + encodeURIComponent(forecastDataURL);

        $http.get(forecastDataURL).success(function (forecastData) {
            // days starting from <today>
            data.forecastDays = [];

            function maximalPossibleEntries(list, maxItems) {
                return list.length > maxItems ? maxItems : list.length;
            }

            for(var i = 0; i <= maximalPossibleEntries(forecastData.list, 3); i++)  {
                var weatherData = parseWeatherData(forecastData.list[i].rain,forecastData.list[i].clouds);

                if(data.fahrenheit)
                {
                    data.forecastDays[i] = {
                        temperatureMin: (((forecastData.list[i].temp.min - 273)  * 1.8) + 32).toFixed(0),
                        temperatureMax: (((forecastData.list[i].temp.max - 273)  * 1.8) + 32).toFixed(0),
                        rain: weatherData.rain,
                        clouds: weatherData.clouds,
                        weatherIco : weatherData.icon
                    };
                }

                if(!data.fahrenheit){
                    data.forecastDays[i] = {
                        temperatureMin: (forecastData.list[i].temp.min - 273).toFixed(0),
                        temperatureMax: (forecastData.list[i].temp.max - 273).toFixed(0),
                        rain: weatherData.rain,
                        clouds: weatherData.clouds,
                        weatherIco : weatherData.icon
                    };
                }
            }
        });
    }

    function loadData() {
        if(weatherConfig.getConfig().location !== undefined && weatherConfig.getConfig().location.name !== undefined)
        {
            data.city_name = weatherConfig.getConfig().location.name;
            data.fahrenheit = weatherConfig.getConfig().fahrenheit;
            setPosition(weatherConfig.getConfig().location);
            getWeather(data);
            getForcast();
        }
    }
    this.loadData = loadData;
    this.getData = function() {
        return data;
    };

    loadData();
    $interval(loadData, 60000 * 5);
}]);
