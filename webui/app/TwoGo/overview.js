angular.module('app.TwoGo', []);
angular.module('app.TwoGo').directive('app.TwoGo', function () {

    var directiveController = ['$scope', function ($scope) {
        Distance = {
            distancefromorigin: 0,
            distancefromdestination: 0
        };
        Distance.set = function () {
            if (localStorage.getItem('distancefromorigin') == null &&
                localStorage.getItem('distancefromdestination') == null) {
                Distance.distancefromorigin = 5000;
                Distance.distancefromdestination = 5000;
            } else {
                Distance.distancefromorigin = localStorage.getItem('distancefromorigin');
                Distance.distancefromdestination = localStorage.getItem('distancefromdestination');
            }

        }
        PARAMS = {
            BASE_URL: "https://twogo-sap-internal.cld.ondemand.com/web/rpc/",
            csrf_token: ""

        };


        $scope.box.boxSize = "2";
        $scope.box.settingsTitle = "Options";
        $scope.box.settingScreenData = {
            templatePath: "TwoGo/settings.html",
            controller: angular.module('app.TwoGo').appTwoGoSettings

        };


        function getRides() {

            document.getElementById("ridesTomorrowMorning").innerHTML = "updating...";
            document.getElementById("ridesTomorrowEvening").innerHTML = "updating...";
            document.getElementById("ridesToday").innerHTML = "updating...";
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
                            Dates.startDay.toISOString(),
                            Dates.endDaySecond.toISOString(),
                            Distance.distancefromorigin,
                            Distance.distancefromdestination
                        ]
                    }
                ],
                "id": 0,
                "parallelProcessing": true
            }


            data = JSON.stringify(data, undefined, 2);

            $.ajax({

                url: PARAMS.BASE_URL + "Batch",
                type: 'POST',
                dataType: 'json',
                data: data,
                contentType: "application/json",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend: $.proxy(function (xhr) {
                    xhr.setRequestHeader("X-CSRF-Token", PARAMS.csrf_token);
                    xhr.setRequestHeader("X-Authentication", "LogoutAfterRequestProcessing");

                    // xhr.setRequestHeader("Authorization", "Basic " + $.base64.encode($("#auth_username").val() + ":" + $("#auth_password").val()));
                }),
                success: $.proxy(function (response) {

                    if (response.error) {

                        alert("ERROR:" + JSON.stringify(response.error));
                        setTimeout(function () {
                            PARAMS.checkBrowser();


                        }, 240000);
                    }
                    else {

                        // var toWork= response["result"][0]["origin"]["shortName"].value;

                        var toHometoday = 0;
                        var toWork = 0;
                        var toHome = 0;
                        if (response.result[1].result !== null) {
                            for (var i = 0; i < response.result[1].result.length; i++) {


                                if (Dates.endDay.toISOString() >= response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["destination"]["shortName"] == "HOME") {
                                    toHometoday++;
                                }
                                else {


                                    if (Dates.endDay.toISOString() < response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["destination"]["shortName"] == "HOME") {

                                        toHome++;
                                    }
                                    else {
                                        if (Dates.endDay.toISOString() < response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["destination"]["shortName"] == "WORK" && response.result[0].result !== null) {

                                            toWork++;

                                        }
                                        else {
                                            if (Dates.endDay.toISOString() < response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["origin"]["shortName"] == "HOME" && response.result[0].result == null) {
                                                toWork++;

                                            }
                                        }

                                    }


                                }


                            }
                        }
                        if (response.result[0].result == null) {
                            document.getElementById("tomorrow").innerHTML = "From HOME";
                        } else {
                            document.getElementById("tomorrow").innerHTML = "To WORK";
                        }

                        document.getElementById("tomorrowh").innerHTML = "To HOME";
                        document.getElementById("today").innerHTML = "To HOME";
                        document.getElementById("ridesToday").innerHTML = toHometoday.toString();
                        document.getElementById("ridesTomorrowMorning").innerHTML = toWork.toString();
                        document.getElementById("ridesTomorrowEvening").innerHTML = toHome.toString();
                        setTimeout(function () {
                            PARAMS.checkBrowser();


                        }, 240000);
                    }
                }),
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);


                }

            });


        }

        function loginOther() {
            var data = {
                "method": "login",
                "params": [],
                "id": 1
            };


            // convert the javascript data object to a pretty printed JSON string
            data = JSON.stringify(data, undefined, 2);
            // make a Ajax POST call via the jQuery Ajax interface

            $.ajax({
                url: PARAMS.BASE_URL + "Authentication", //+this.currentMethod.className,
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


                    if (response.error)
                        alert("ERROR:" + JSON.stringify(response.error));
                    else {
                        //  alert("SUCCESS:"+JSON.stringify(response.result));
                        // csrf_token = response["result"]["csrf"]["header"].value;
                        PARAMS.csrf_token = response["result"]["csrf"]["header"].value;


                        $(function () {

                            getRides();

                        });

                    }
                }),
                error: function (xhr, status, error) {
                    alert(xhr.status);
                    alert(error);
                    alert(status);

                }

            });

        }

        function loginIE() {

            var data = {
                "method": "login",
                "params": [],
                "id": 1
            };


            // convert the javascript data object to a pretty printed JSON string
            data = JSON.stringify(data, undefined, 2);
            // make a Ajax POST call via the jQuery Ajax interface

            $.ajax({
                url: PARAMS.BASE_URL + "Authentication", //+this.currentMethod.className,
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


                    if (response.error)
                        alert("ERROR:" + JSON.stringify(response.error));
                    else {
                        //  alert("SUCCESS:"+JSON.stringify(response.result));
                        // csrf_token = response["result"]["csrf"]["header"].value;
                        PARAMS.csrf_token = response["result"]["csrf"]["header"].value;


                        $(function () {

                            getRides();

                        });

                    }
                }),
                error: function (http, status, error) {
                    alert(http.status);
                    alert(error);
                    alert(status);

                }

            });

        }

        function http() {
            var http = new XMLHttpRequest();
             var url = PARAMS.BASE_URL + "Authentication";
            var params = "";

            http.open("POST", url, true);

//Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");


            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {

                    $(function () {
                        debugger;
                        loginIE();

                    });
                }
            }
            http.send(params);

        }


        function checkBrowserName(name) {
            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf(name.toLowerCase()) > -1) {
                return true;
            }
            return false;
        }

        Dates = {
            startDay: 0,
            endDay: 0,
            endDaySecond: 0

        };
        PARAMS.checkBrowser=function () {

            Dates.startDay = new Date();
            Dates.endDay = new Date();
            Dates.endDay.setHours(0, 0, 0, 0);
            Dates.endDay.setDate(Dates.endDay.getDate() + 1);
            Dates.endDaySecond = new Date();
            Dates.endDaySecond.setHours(0, 0, 0, 0);
            Dates.endDaySecond.setDate(Dates.endDaySecond.getDate() + 2);
            if (checkBrowserName('MSIE')) {

                $(function () {

                    http();

                });
            } else {
                $(function () {

                    loginOther();

                });
            }

        }
        $(function () {

            Distance.set();

        });
        $(function () {

            PARAMS.checkBrowser();

        });

    }];


    return {
        restrict: 'E',
        templateUrl: "app/TwoGo/overview.html",
        controller: directiveController

    };

});
