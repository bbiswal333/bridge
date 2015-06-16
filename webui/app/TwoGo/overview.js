/*eslint-disable no-alert, no-undef, dot-notation */
angular.module('app.TwoGo', ['app.TwoGo.data']);
angular.module('app.TwoGo').directive('app.TwoGo', ['app.TwoGo.configService', 'app.TwoGo.dataService', function (configService, dataService) {

    var directiveController = ['$scope', function ($scope) {

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
        $scope.ridesTomorrowMorning = "-";
        $scope.ridesTomorrowEvening = "-";
        $scope.ridesToday = "-";
        $scope.tomorrowh = "To HOME";
        $scope.today = "To HOME";
        $scope.tomorrow = "From HOME";
        $scope.Header = "TWOGO RIDES IN YOUR NEIGHBOURHOOD";
        $scope.HeaderToday = "Today";
        $scope.HeaderTomorrow = "Tomorrow";
        $scope.checkBrowser = function () {
//setting the Dates
            startDay = new Date();
            endDay = new Date();
            endDay.setHours(0, 0, 0, 0);
            endDay.setDate(endDay.getDate() + 1);
            endDaySecond = new Date();
            endDaySecond.setHours(0, 0, 0, 0);
            endDaySecond.setDate(endDaySecond.getDate() + 2);
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
//ajaxcall for getting the Rides and the WORKPOI if exists
            $.ajax({

                url: BASE_URL + "Batch",
                type: 'POST',
                dataType: 'json',
                data: data,
                contentType: "application/json",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend: $.proxy(function (xhr) {
                    xhr.setRequestHeader("X-CSRF-Token", csrf_token);
                    xhr.setRequestHeader("X-Authentication", "LogoutAfterRequestProcessing");

                }),
                success: $.proxy(function (response) {

                    if (response.error) {

                        alert("ERROR:" + JSON.stringify(response.error));

                    }
                    else {


//Counting the Rides
                        var toHometoday = 0;
                        var toWork = 0;
                        var toHome = 0;
                        var i = 0;
                        var duplicate1 = "";
                        var duplicate2 = "";
                        var duplicate3 = "";
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
                            }), rideProposals[i]["origin"]["shortName"], rideProposals[i]["destination"]["shortName"], rideProposals[i]["createAsDriverUrl"], rideProposals[i]["createAsPassengerUrl"], v[0], v[1]]);
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

                                if (rideProposals[i]["createAsDriverUrl"] != null && rideProposals[i]["createAsPassengerUrl"] != null) {
                                    v = ["invisible-button", "invisible-button"];
                                }
                                else {
                                    if (rideProposals[i]["createAsDriverUrl"] == null && rideProposals[i]["createAsPassengerUrl"] != null) {
                                        v = ["disabled", "invisible-button"];
                                    } else {
                                        if (rideProposals[i]["createAsDriverUrl"] != null && rideProposals[i]["createAsPassengerUrl"] == null) {
                                            v = ["invisible-button", "disabled"];
                                        }


                                    }

                                }


                                if (endDay.toISOString() >= rideProposals[i]["earliestDeparture"] && rideProposals[i]["destination"]["shortName"] === "HOME") {

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


                                    if (endDay.toISOString() < rideProposals[i]["earliestDeparture"] && rideProposals[i]["destination"]["shortName"] === "HOME") {

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
                                        if (endDay.toISOString() < rideProposals[i]["earliestDeparture"] && rideProposals[i]["destination"]["shortName"] === "WORK" && response.result[0].result !== null) {
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
                                            if (endDay.toISOString() < rideProposals[i]["earliestDeparture"] && rideProposals[i]["origin"]["shortName"] === "HOME" && response.result[0].result === null) {
                                                toWork++;

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
                        $scope.ridesToday = toHometoday.toString();
                        $scope.ridesTomorrowMorning = toWork.toString();
                        $scope.ridesTomorrowEvening = toHome.toString();

                    }
                }),
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);


                }

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

            $.ajax({
                url: BASE_URL + "Authentication", //+this.currentMethod.className,
                type: 'POST',
                data: data,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend: $.proxy(function (xhr) {

                    xhr.setRequestHeader("X-CSRF-Token", "Fetch");
//xhr.setRequestHeader("Connection", "keep-alive")
                    //  xhr.setRequestHeader("Authorization", "Basic " + hash);

                }),

                success: $.proxy(function (response) {


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
                    }
                    else {
                        //  alert("SUCCESS:"+JSON.stringify(response.result));
                        // csrf_token = response["result"]["csrf"]["header"].value;
                        csrf_token = response["result"]["csrf"]["header"].value;


                        $(function () {

                            $scope.getRides();

                        });

                    }
                }),
                error: function (xhr, status, error) {
                    alert(xhr.status);
                    alert(error);
                    alert(status);

                }

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

            $.ajax({
                url: BASE_URL + "Authentication", //+this.currentMethod.className,
                type: 'POST',
                data: data,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend: $.proxy(function (http) {
                    http.setRequestHeader("X-CSRF-Token", "Fetch");
//xhr.setRequestHeader("Connection", "keep-alive")
                    //  xhr.setRequestHeader("Authorization", "Basic " + hash);

                }),

                success: $.proxy(function (response) {


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
                    }
                    else {
                        //  alert("SUCCESS:"+JSON.stringify(response.result));
                        // csrf_token = response["result"]["csrf"]["header"].value;
                        csrf_token = response["result"]["csrf"]["header"].value;


                        $(function () {

                            $scope.getRides();

                        });

                    }
                }),
                error: function (http, status, error) {
                    alert(http.status);
                    alert(error);
                    alert(status);
                }

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
            $scope.distancefromdestination = $scope.appConfig.values.distancefromdestination;
            $scope.distancefromorigin = $scope.appConfig.values.distancefromorigin;
            $scope.ridesTomorrowMorning = "-";
            $scope.ridesTomorrowEvening = "-";
            $scope.ridesToday = "-";

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

}]);
/*eslint-enable no-alert, no-undef, dot-notation*/
