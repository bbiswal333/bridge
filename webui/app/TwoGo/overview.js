/*eslint-disable no-alert, no-undef, dot-notation */
angular.module('app.TwoGo', ['app.TwoGo.data']);
angular.module('app.TwoGo').directive('app.TwoGo', ['app.TwoGo.configService', 'app.TwoGo.dataService', function (configService, dataService) {
    var directiveController;
    directiveController = ['$scope', '$http', function ($scope, $http) {
        $scope.setLinkClicked = function (i) {
            dataService.setWhichLinkClicked(i);
        };
//variable for the Dates
        var startDay = 0;
        var endDay = 0;
        var endDaySecond = 0;
//Url from the TwoGo server
        var BASE_URL = "https://twogo-sap-internal.cld.ondemand.com/web/rpc/";
        var csrf_token = "";
        //initialisation of the Tables
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
        $scope.box.boxSize = "2";
        $scope.box.settingsTitle = "Options";
        $scope.box.settingScreenData = {
            templatePath: "TwoGo/settings.html",
            controller: angular.module('app.TwoGo').appTwoGoSettings
        };
        $scope.box.returnConfig = function () {
            return angular.copy(configService);
        };
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
            $http.post(BASE_URL + "Batch", data, {
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
                        var toHometoday = 0;
                        var toWork = 0;
                        var toHome = 0;
                        var i = 0;
                        var duplicate1 = "";
                        var duplicate2 = "";
                        var duplicate3 = "";
                        var startOfTomorrowOrMonday = new Date(endDaySecond);
                    startOfTomorrowOrMonday.setDate(endDaySecond.getDate() - 1);
                        $scope.arrayToHome = [];
                        $scope.arrayToHomeToday = [];
                        $scope.arrayToWork = [];
                        var rideProposals = response.result[1].result;
                        var v = [];
                        //function to create the Arrays for Today Tomorrow To Work and Tomorrow to Home
                        $scope.createArray = function (arrayToCreate) {
                            arrayToCreate.push([new Date(rideProposals[i]["earliestDeparture"]).toLocaleTimeString(navigator.language, {
                                hour: '2-digit',
                                minute: '2-digit'
                            }), new Date(rideProposals[i]["latestArrival"]).toLocaleTimeString(navigator.language, {
                                hour: '2-digit',
                                minute: '2-digit'
                            }), rideProposals[i]["origin"]["shortName"], rideProposals[i]["destination"]["shortName"], rideProposals[i]["createAsDriverUrl"]+"&source=bridge", rideProposals[i]["createAsPassengerUrl"]+"&source=bridge", v[0], v[1]]);
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
                                if (rideProposals[i]["role"] ==="DriverOrPassenger") {
                                    v = ["invisible-button", "invisible-button"];
                                }
                                else {
                                    if (rideProposals[i]["role"] ==="Passenger") {
                                        v = ["disabled", "invisible-button"];
                                    } else {
                                        if (rideProposals[i]["role"] ==="Driver") {
                                            v = ["invisible-button", "disabled"];
                                        }
                                    }
                                }
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
                        //changing one heading if nor WORKPOI exists
                        if (response.result[0].result == null) {
                            $scope.tomorrow = "From HOME";
                        } else {
                            $scope.tomorrow = "To WORK";
                        }

                        dataService.setArrayToday(
                            $scope.arrayToHomeToday);

                        dataService.setArrayTomorrowH(
                            $scope.arrayToHome
                        );
                        dataService.setArrayTomorrow(
                            $scope.arrayToWork
                        );
                        // and writing the number into the right tables
                        $scope.spinner = "";
                        $scope.tableSize = "20%";
                        $scope.ridesToday = toHometoday.toString();
                        $scope.ridesTomorrowMorning = toWork.toString();
                        $scope.ridesTomorrowEvening = toHome.toString();
                        $scope.tomorrowh = "To HOME";
                        $scope.today = "To HOME";
                        $scope.HeaderToday = "Today";
                        if (startOfTomorrowOrMonday.getUTCDay() === 6) {
                            $scope.HeaderTomorrow = "Monday";
                        } else {
                            $scope.HeaderTomorrow = "Tomorrow";
                        }

                    }
                })).
                error(function (status) {
                    "Request failed";
                    $scope.status = status;
                });
        };
//function which includes the Ajax call for the login of the user
        $scope.loginOther = function () {
            var data = {
                "method": "login",
                "params": [],
                "id": 1
            };
            $scope.url = function (response) {
                alert(response.result[1].result[0]["createAsPassengerUrl"]);
            };
            // convert the javascript data object to a pretty printed JSON string
            data = JSON.stringify(data, undefined, 2);
            // make a Ajax POST call via the jQuery Ajax interface
            $http.post(BASE_URL + "Authentication", data, {
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
                    "Request failed";
                    $scope.status = status;
                });
        };
//function which includes the Ajax call for the login of the user using the created http value instat of the Xhr otherwise it wont work
        $scope.loginIE = function () {
            var data = {
                "method": "login",
                "params": [],
                "id": 1
            };
            // convert the javascript data object to a pretty printed JSON string
            data = JSON.stringify(data, undefined, 2);
            // make a Ajax POST call via the jQuery Ajax interface
            $http.post(BASE_URL + "Authentication", data, {
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
                    "Request failed";
                    $scope.status = status;
                });
        };
//functin which creates an new xhr called http
        $scope.http = function () {
            var http = new XMLHttpRequest();
            var url = BASE_URL + "Authentication";
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
        $scope.checkBrowserName = function (name) {
            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf(name.toLowerCase()) > -1) {
                return true;
            }
            return false;
        };
        $scope.box.reloadApp($scope.checkBrowser, 3600);
    }];
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
