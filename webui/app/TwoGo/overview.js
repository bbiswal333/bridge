/*eslint-disable no-alert, no-undef, dot-notation */
angular.module('app.TwoGo', ['app.TwoGo.data']);
angular.module('app.TwoGo').directive('app.TwoGo', ['app.TwoGo.configService', 'app.TwoGo.dataService', function (configService, dataService) {
    var directiveController;
    directiveController = ['$scope', '$http', function ($scope, $http) {
        $scope.setLinkClicked = function (i) {
            dataService.setWhichLinkClicked(i);
        };
//variables for the Dates
        var startDay = 0;
        var endDay = 0;
        var endDaySecond = 0;
//Urls from the TwoGo server
        var BASE_URL_LOGIN = "https://access.twogo.com/web/rpc/";
        var BASE_URL_BACKEND = "https://www.twogo.com/web/rpc/";
        var csrf_token = "";
        //initialisation of the Tables in the start screen
        $scope.tableSize = "40%";
        $scope.spinner = "fa fa-pulse fa-spinner  fa-4x";
        $scope.ridesTomorrowMorning = "";
        $scope.ridesTomorrowEvening = "";
        $scope.ridesToday = "";
        $scope.tomorrowh = "";
        $scope.today = "";
        $scope.tomorrow = "";
        $scope.Header = "TWOGO RIDES IN YOUR NEIGHBORHOOD";
        $scope.HeaderToday = "";
        $scope.HeaderTomorrow = "";
        //function which checks which Browser is used
        $scope.checkBrowser = function () {
//setting the Dates
            startDay = new Date();
            endDay = new Date();
            endDay.setHours(0, 0, 0, 0);
            endDay.setDate(endDay.getDate() + 1);
            endDaySecond = new Date();
            endDaySecond.setHours(0, 0, 0, 0);
            endDaySecond.setDate(endDaySecond.getDate() + 2);
            if (endDaySecond.getUTCDay() === 6) {

                endDaySecond.setDate(endDaySecond.getDate() + 2);

            } else {

                if (endDaySecond.getUTCDay() === 0) {

                    endDaySecond.setDate(endDaySecond.getDate() + 1);

                }
            }
            //check if InternetExplorer or any other browser
            if ($scope.checkBrowserName('MSIE')) {
                $(function () {
                    $scope.http();
                });
            } else {
                $(function () {
                    $scope.loginOther();
                });
            }
        };
        //Initilisation of start screen(setting box size etc.)
        //Setting Data for the SettingsScreen
        $scope.box.boxSize = "2";
        $scope.box.settingsTitle = "Options";
        $scope.box.settingScreenData = {
            templatePath: "TwoGo/settings.html",
            controller: angular.module('app.TwoGo').appTwoGoSettings
        };
        //function for getting the config after Page Reload
        $scope.box.returnConfig = function () {
            return angular.copy(configService);
        };
        //Batchcall for getting the Work POI and the Rideproposals of the USer
        $scope.getRides = function () {
//Setting the wanted Methods and the parameters
            var data = {
                "method": "execute",
                "params": [
                    {
                        "id": "request1",
                        "service": "UserPoi",
                        "method": "findByName",
                        "params": [
                            "WORK"
                        ]
                    },
                    {
                        "id": "request2",
                        "service": "Rippler",
                        "method": "getRideProposals",
                        "params": [
                            startDay.toISOString(),
                            endDaySecond.toISOString(),
                            $scope.distancefromorigin,
                            $scope.distancefromdestination
                        ]
                    }
                ],
                "id": 0,
                "parallelProcessing": true
            };
            data = JSON.stringify(data, undefined, 2);
//call for getting the Rides and the WORKPOI if exists
            $http.post(BASE_URL_BACKEND + "Batch", data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrf_token

                }
            }, {
                withCredentials: true
            }).success(
                $.proxy(function (response) {
                    if (response.error) {
                        alert("ERROR:" + JSON.stringify(response.error));
                    }
                    else {
                        //variable for counting the rideProposals
                        var toHometoday = 0;
                        var toWork = 0;
                        var toHome = 0;
                        var i = 0;
                        //Variable to check for dublicates
                        var duplicate1 = "";
                        var duplicate2 = "";
                        var duplicate3 = "";
                        var startOfTomorrowOrMonday = new Date(endDaySecond);
                        startOfTomorrowOrMonday.setDate(endDaySecond.getDate() - 1);
                        //Arrays for the different Times(Toda to Home, Tomorroe To Work, Tomorrow to Home)
                        $scope.arrayToHome = [];
                        $scope.arrayToHomeToday = [];
                        $scope.arrayToWork = [];
                        var rideProposals = response.result[1].result;
                        var v = [];
                        //function to create the Arrays for Today to Home, Tomorrow To Work and Tomorrow to Home
                        $scope.createArray = function (arrayToCreate) {
                            arrayToCreate.push([new Date(rideProposals[i]["earliestDeparture"]).toLocaleTimeString(navigator.language, {
                                hour: '2-digit',
                                minute: '2-digit'
                            }), new Date(rideProposals[i]["latestArrival"]).toLocaleTimeString(navigator.language, {
                                hour: '2-digit',
                                minute: '2-digit'
                            }), rideProposals[i]["origin"]["shortName"], rideProposals[i]["destination"]["shortName"], rideProposals[i]["createAsDriverUrl"] + "&source=bridge", rideProposals[i]["createAsPassengerUrl"] + "&source=bridge", v[0], v[1]]);
                        };
//sets the Value for the check if there are duplicates
                        $scope.setConcatValue = function (concatValue) {
                            concatValue = new Date(rideProposals[i]["earliestDeparture"]).toLocaleTimeString(navigator.language, {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) + "" + new Date(rideProposals[i]["latestArrival"]).toLocaleTimeString(navigator.language, {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) + "" + rideProposals[i]["origin"]["shortName"] + "" + rideProposals[i]["destination"]["shortName"] + "" + v[0] + "" + v[1];
                            return concatValue;
                        };
                        //sorting the rideProposals
                        if (rideProposals !== null) {
                            rideProposals.sort(function (a, b) {
                                var vergleich1 = new Date(a.earliestDeparture).toISOString() + new Date(a.latestArrival).toISOString() + a.origin.shortName + a.destination.shortName + a.role;
                                var vergleich2 = new Date(b.earliestDeparture).toISOString() + new Date(b.latestArrival).toISOString() + b.origin.shortName + b.destination.shortName + b.role;
                                return vergleich1 > vergleich2 ? 1 : -1;
                            });
//Adding the State for the UrlButton
                            for (i = 0; i < rideProposals.length; i++) {
                                if (rideProposals[i]["role"] === "DriverOrPassenger") {
                                    v = ["invisible-button", "invisible-button"];
                                }
                                else {
                                    if (rideProposals[i]["role"] === "Passenger") {
                                        v = ["disabled", "invisible-button"];
                                    } else {
                                        if (rideProposals[i]["role"] === "Driver") {
                                            v = ["invisible-button", "disabled"];
                                        }
                                    }
                                }
                                //Counting the rideproposals an checking for dublicates
                                if (endDay >= new Date(rideProposals[i]["earliestDeparture"]) && rideProposals[i]["destination"]["shortName"] === "HOME") {
                                    if ($scope.arrayToHomeToday.length === 0) {
                                        duplicate1 = $scope.setConcatValue(duplicate1);
                                        toHometoday++;
                                        $scope.createArray($scope.arrayToHomeToday);
                                    } else {
                                        if (duplicate1 !== new Date(rideProposals[i]["earliestDeparture"]).toLocaleTimeString(navigator.language, {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) + "" + new Date(rideProposals[i]["latestArrival"]).toLocaleTimeString(navigator.language, {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) + "" + rideProposals[i]["origin"]["shortName"] + "" + rideProposals[i]["destination"]["shortName"] + "" + v[0] + "" + v[1]) {
                                            toHometoday++;
                                            $scope.createArray($scope.arrayToHomeToday);
                                            duplicate1 = $scope.setConcatValue(duplicate1);
                                        }
                                    }
                                }
                                else {
                                    if (startOfTomorrowOrMonday < new Date(rideProposals[i]["earliestDeparture"]) && rideProposals[i]["destination"]["shortName"] === "HOME") {
                                        if ($scope.arrayToHome.length === 0) {
                                            duplicate2 = $scope.setConcatValue(duplicate2);
                                            toHome++;
                                            $scope.createArray($scope.arrayToHome);
                                        } else {
                                            if (duplicate2 !== new Date(rideProposals[i]["earliestDeparture"]).toLocaleTimeString(navigator.language, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) + "" + new Date(rideProposals[i]["latestArrival"]).toLocaleTimeString(navigator.language, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) + "" + rideProposals[i]["origin"]["shortName"] + "" + rideProposals[i]["destination"]["shortName"] + "" + v[0] + "" + v[1]) {
                                                $scope.createArray($scope.arrayToHome);
                                                toHome++;
                                                duplicate2 = $scope.setConcatValue(duplicate2);
                                            }
                                        }
                                    }
                                    else {
                                        if (startOfTomorrowOrMonday < new Date(rideProposals[i]["earliestDeparture"]) && rideProposals[i]["destination"]["shortName"] === "WORK" && response.result[0].result !== null) {
                                            if ($scope.arrayToWork.length === 0) {
                                                duplicate3 = $scope.setConcatValue(duplicate3);
                                                toWork++;
                                                $scope.createArray($scope.arrayToWork);
                                            } else {
                                                if (duplicate3 !== new Date(rideProposals[i]["earliestDeparture"]).toLocaleTimeString(navigator.language, {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) + "" + new Date(rideProposals[i]["latestArrival"]).toLocaleTimeString(navigator.language, {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) + "" + rideProposals[i]["origin"]["shortName"] + "" + rideProposals[i]["destination"]["shortName"] + "" + v[0] + "" + v[1]) {
                                                    toWork++;
                                                    $scope.createArray($scope.arrayToWork);
                                                    duplicate3 = $scope.setConcatValue(duplicate3);
                                                }
                                            }
                                        }
                                        else {
                                            if (startOfTomorrowOrMonday < new Date(rideProposals[i]["earliestDeparture"]) && rideProposals[i]["origin"]["shortName"] === "HOME" && response.result[0].result === null) {
                                                if ($scope.arrayToWork.length === 0) {
                                                    duplicate3 = $scope.setConcatValue(duplicate3);
                                                    toWork++;
                                                    $scope.createArray($scope.arrayToWork);
                                                } else {
                                                    if (duplicate3 !== new Date(rideProposals[i]["earliestDeparture"]).toLocaleTimeString(navigator.language, {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) + "" + new Date(rideProposals[i]["latestArrival"]).toLocaleTimeString(navigator.language, {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) + "" + rideProposals[i]["origin"]["shortName"] + "" + rideProposals[i]["destination"]["shortName"] + "" + v[0] + "" + v[1]) {
                                                        toWork++;
                                                        $scope.createArray($scope.arrayToWork);
                                                        duplicate3 = $scope.setConcatValue(duplicate3);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //changing one header if no WORKPOI exists
                        if (response.result[0].result == null) {
                            $scope.tomorrow = "From HOME";
                        } else {
                            $scope.tomorrow = "To WORK";
                        }
//the which angularjs reads(See in data.html) gets the values of the arrays where the right ride poposals are sorted an wihtout dublicates
                        dataService.setArrayToday(
                            $scope.arrayToHomeToday);

                        dataService.setArrayTomorrowH(
                            $scope.arrayToHome
                        );
                        dataService.setArrayTomorrow(
                            $scope.arrayToWork
                        );
                        //  writing the values into the right tables(deleting spinner etc.)
                        $scope.spinner = "";
                        $scope.tableSize = "20%";
                        $scope.ridesToday = toHometoday.toString();
                        $scope.ridesTomorrowMorning = toWork.toString();
                        $scope.ridesTomorrowEvening = toHome.toString();
                        $scope.tomorrowh = "To HOME";
                        $scope.today = "To HOME";
                        $scope.HeaderToday = "Today";
                        if (startOfTomorrowOrMonday.getUTCDay() === 0) {
                            $scope.HeaderTomorrow = "Monday";
                        } else {
                            $scope.HeaderTomorrow = "Tomorrow";
                        }

                    }
                })).
                error(function (status) {
                    alert("GetRideProposals failed");
                    $scope.status = status;
                });
        };
//function which includes the http.call for the login of the user when no IE is used
        $scope.loginOther = function () {
            //Data for the call is set
            var data = {
                "method": "login",
                "params": [],
                "id": 1
            };
            // convert the javascript data object to a pretty printed JSON string
            data = JSON.stringify(data, undefined, 2);
            // make a http POST call (means same as ajax call but ist like this in angularjs)
            $http.post(BASE_URL_LOGIN + "Authentication", data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": "Fetch"

                }
            }, {
                withCredentials: true
            }).success($.proxy(function (response) {
                if (response.error) {
                    $scope.Header = ("You First need to create a TwoGo User ");
                    $scope.linked = ("https://www.twogo.com/#signup");
                    $scope.here = ("here");
                    $scope.ridesTomorrowMorning = "";
                    $scope.ridesTomorrowEvening = "";
                    $scope.ridesToday = "";
                    $scope.tomorrowh = "";
                    $scope.today = "";
                    $scope.tomorrow = "";
                    $scope.HeaderToday = "";
                    $scope.HeaderTomorrow = "";
                    $scope.spinner = "";
                }
                else {
                    csrf_token = response["result"]["csrf"]["header"].value;
                    $(function () {
                        $scope.getRides();
                    });
                }
            })).
                error(function (status) {


                    $scope.status = status;
                    alert("login failed");
                });
        };
//function which includes the http call for the login of the user using the created http value instat of the Xhr otherwise it wont work
        $scope.loginIE = function () {
            var data = {
                "method": "login",
                "params": [],
                "id": 1
            };
            // convert the javascript data object to a pretty printed JSON string
            data = JSON.stringify(data, undefined, 2);
            // make a http POST call
            $http.post(BASE_URL_LOGIN + "Authentication", data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": "Fetch"
                }
            }, {
                withCredentials: true
            }).success($.proxy(function (response) {
                if (response.error) {
                    $scope.Header = ("You First need to create a TwoGo User ");
                    $scope.linked = ("https://www.twogo.com/#signup");
                    $scope.here = ("here");
                    $scope.ridesTomorrowMorning = "";
                    $scope.ridesTomorrowEvening = "";
                    $scope.ridesToday = "";
                    $scope.tomorrowh = "";
                    $scope.today = "";
                    $scope.tomorrow = "";
                    $scope.HeaderToday = "";
                    $scope.HeaderTomorrow = "";
                    $scope.spinner = "";
                }
                else {
                    //  alert("SUCCESS:"+JSON.stringify(response.result));
                    // csrf_token = response["result"]["csrf"]["header"].value;
                    csrf_token = response["result"]["csrf"]["header"].value;
                    $(function () {
                        $scope.getRides();
                    });
                }
            })).
                error(function (status) {
                    alert("login failed");
                    $scope.status = status;
                });
        };
//function which creates an new xhr called http
        $scope.http = function () {
            var http = new XMLHttpRequest();
            var url = BASE_URL_LOGIN + "Authentication";
            var params = "";
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState === 4 && http.status === 200) {
                    $(function () {
                        $scope.loginIE();
                    });
                }
            };
            http.send(params);
        };
        //converts Browser name taht it can be checked right
        $scope.checkBrowserName = function (name) {
            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf(name.toLowerCase()) > -1) {
                return true;
            }
            return false;
        };
        //function that refreches the app after one hour(Time is set in seconds)
        $scope.box.reloadApp($scope.checkBrowser, 900);
    }];

    //function that saves the configuration
    var linkFn = function ($scope) {
        // get own instance of config service, $scope.appConfig contains the configuration from the backend
        configService.initialize($scope.appConfig);
        // watch on any changes in the settings screen
        $scope.$watch("appConfig.values", function () {
            $scope.spinner = "fa fa-pulse fa-spinner  fa-4x";
            $scope.tableSize = "40%";
            $scope.distancefromdestination = $scope.appConfig.values.distancefromdestination;
            $scope.distancefromorigin = $scope.appConfig.values.distancefromorigin;
            $scope.ridesTomorrowMorning = "";
            $scope.ridesTomorrowEvening = "";
            $scope.ridesToday = "";
            $scope.tomorrowh = "";
            $scope.today = "";
            $scope.tomorrow = "";
            $scope.HeaderToday = "";
            $scope.HeaderTomorrow = "";
            $(function () {
                $scope.checkBrowser();
            });
        }, true);
    };
    return {
        restrict: 'E',
        templateUrl: "app/TwoGo/overview.html",
        controller: directiveController,
        link: linkFn
    };
}])
;
/*eslint-enable no-alert, no-undef, dot-notation*/
