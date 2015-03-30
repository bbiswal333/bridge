angular.module("bridge.app").service("bridge.menubar.weather.weatherData", ["bridge.menubar.weather.configservice", "lib.utils.calUtils", "bridgeDataService", "$http", "$interval", "bridgeBuildingSearch", function(weatherConfig, calUtils, bridgeDataService, $http, $interval, bridgeBuildingSearch) {
    var data = {};

    function mapWeatherData(weatherData) {
        var resultData = {};
        resultData.description = weatherData.description;
        switch(weatherData.id) {
            case 200:
            case 201:
            case 202:
            case 210:
            case 211:
            case 212:
            case 221:
            case 230:
            case 231:
            case 232:
                resultData.icon = 'wi wi-thunderstorm';
                break;
            case 300:
            case 301:
            case 302:
            case 310:
            case 311:
            case 312:
            case 313:
            case 314:
            case 321:
                resultData.icon = 'wi wi-rain-mix';
                break;
            case 500:
            case 501:
            case 502:
            case 503:
            case 504:
            case 511:
            case 520:
            case 521:
            case 522:
            case 531:
                resultData.icon = 'wi wi-rain';
                break;
            case 600:
            case 601:
            case 602:
            case 611:
            case 612:
            case 615:
            case 616:
            case 620:
            case 621:
            case 622:
                resultData.icon = 'wi wi-snow';
                break;
            case 600:
            case 601:
            case 602:
            case 611:
            case 612:
            case 615:
            case 616:
            case 620:
            case 621:
            case 622:
                resultData.icon = 'wi wi-snow';
                break;
            case 701:
            case 711:
            case 721:
            case 731:
            case 741:
            case 751:
            case 761:
            case 762:
            case 771:
            case 781:
                resultData.icon = 'wi wi-dust';
                break;
            case 800:
                resultData.icon = 'wi wi-day-sunny';
                break;
            case 801:
                resultData.icon = 'wi wi-day-cloudy';
                break;
            case 802:
                resultData.icon = 'wi wi-cloudy';
                break;
            case 803:
            case 804:
                resultData.icon = 'wi wi-cloudy';
                break;
            case 900:
                resultData.icon = 'wi wi-tornado';
                break;
            case 901:
                resultData.icon = 'wi wi-day-sleet-storm';
                break;
            case 902:
                resultData.icon = 'wi wi-hurricane';
                break;
            case 903:
                resultData.icon = 'wi wi-snowflake-cold';
                break;
            case 904:
                resultData.icon = 'wi wi-hot';
                break;
            case 905:
                resultData.icon = 'wi wi-strong-wind';
                break;
            case 906:
                resultData.icon = 'wi-hail';
                break;
        }
        return resultData;
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

    var aprilFoolsJokeData = [
        {
            description: "Alien Invasion",
            weatherIcon: "wi wi-alien"
        },
        {
            description: "Meteor",
            weatherIcon: "wi wi-meteor"
        },
        {
            description: "Tornado",
            weatherIcon: "wi wi-tornado"
        }
    ];

    function extractDataFromWeatherDataToTargetObject(weatherData, targetObject) {
        if(new Date().getMonth() === 3 && new Date().getDate() === 1) {
            var data = aprilFoolsJokeData[Math.round(Math.random() * 2)];
            targetObject.description = data.description;
            targetObject.weatherIcon = data.weatherIcon;
            targetObject.weatherIco = data.weatherIcon;
        } else {
            targetObject.description = weatherData.description;
            targetObject.weatherIcon = weatherData.icon;
            targetObject.weatherIco = weatherData.icon;
            targetObject.rain = weatherData.rain;
            targetObject.clouds = weatherData.clouds;
        }
    }


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

            var weatherData = mapWeatherData(weatherDataJSON.weather[0]);

            targetObject.city = weatherDataJSON.name;
            targetObject.city_id = weatherDataJSON.id;

            extractDataFromWeatherDataToTargetObject(weatherData, targetObject);
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
                var weatherData = mapWeatherData(forecastData.list[i].weather[0]);

                if(data.fahrenheit)
                {
                    data.forecastDays[i] = {
                        temperatureMin: (((forecastData.list[i].temp.min - 273)  * 1.8) + 32).toFixed(0),
                        temperatureMax: (((forecastData.list[i].temp.max - 273)  * 1.8) + 32).toFixed(0)
                    };
                }

                if(!data.fahrenheit){
                    data.forecastDays[i] = {
                        temperatureMin: (forecastData.list[i].temp.min - 273).toFixed(0),
                        temperatureMax: (forecastData.list[i].temp.max - 273).toFixed(0)
                    };
                }

                extractDataFromWeatherDataToTargetObject(weatherData, data.forecastDays[i]);
            }
        });
    }

    function loadDataForLocation(location) {
        if(location !== undefined && location.name !== undefined)
        {
            data.city_name = location.name;
            data.fahrenheit = weatherConfig.getConfig().fahrenheit;
            setPosition(location);
            getWeather(data);
            getForcast();
        }
    }

    function loadData() {
        var location = weatherConfig.getConfig().location;

        if(typeof location === "string") {
            bridgeBuildingSearch.searchLocation(location).then(function(locations) {
                location = locations[0];
                loadDataForLocation(location);
            });
        } else {
            loadDataForLocation(location);
        }
    }
    this.loadData = loadData;
    this.getData = function() {
        return data;
    };

    weatherConfig.initialize().then(function() {
        loadData();
        $interval(loadData, 60000 * 5);
    });
}]);
