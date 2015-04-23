angular.module('app.TwoGo', []);
angular.module('app.TwoGo').directive('app.TwoGo', ['app.TwoGo.configService', function (configService) {

    var directiveController = ['$scope', function ($scope) {

        var startDay = 0;
        var endDay = 0;
        var endDaySecond = 0;

        var BASE_URL = "https://twogo-sap-internal.cld.ondemand.com/web/rpc/";
        var csrf_token = "";
        $scope.ridesTomorrowMorning = "-";
        $scope.ridesTomorrowEvening = "-";
        $scope.ridesToday = "-";
        $scope.tomorrowh = "To HOME";
        $scope.today = "To HOME";
        $scope.tomorrow = "From HOME";
        $scope.checkBrowser = function () {

            startDay = new Date();
            endDay = new Date();
            endDay.setHours(0, 0, 0, 0);
            endDay.setDate(endDay.getDate() + 1);
            endDaySecond = new Date();
            endDaySecond.setHours(0, 0, 0, 0);
            endDaySecond.setDate(endDaySecond.getDate() + 2);
            if ($scope.checkBrowserName('MSIE')) {

                $(function () {

                    $scope.http();

                });
            } else {
                $(function () {

                    $scope.loginOther();

                });
            }

        }

        $scope.box.boxSize = "2";
        $scope.box.settingsTitle = "Options";
        $scope.box.settingScreenData = {
            templatePath: "TwoGo/settings.html",
            controller: angular.module('app.TwoGo').appTwoGoSettings

        };
        $scope.box.returnConfig = function () {
           debugger;
            if($scope.change ==true) {
                $scope.ridesTomorrowMorning = "-";
                $scope.ridesTomorrowEvening = "-";
                $scope.ridesToday = "-";

                $(function () {

                    $scope.checkBrowser();
                })

                return angular.copy(configService);
            }else{

            }
        };

        $scope.getRides = function () {


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
                            $scope.distancefromorigin
                        ]
                    }
                ],
                "id": 0,
                "parallelProcessing": true
            }


            data = JSON.stringify(data, undefined, 2);

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



                        var toHometoday = 0;
                        var toWork = 0;
                        var toHome = 0;
                        if (response.result[1].result !== null) {
                            for (var i = 0; i < response.result[1].result.length; i++) {


                                if (endDay.toISOString() >= response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["destination"]["shortName"] == "HOME") {
                                    toHometoday++;
                                }
                                else {


                                    if (endDay.toISOString() < response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["destination"]["shortName"] == "HOME") {

                                        toHome++;
                                    }
                                    else {
                                        if (endDay.toISOString() < response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["destination"]["shortName"] == "WORK" && response.result[0].result !== null) {

                                            toWork++;

                                        }
                                        else {
                                            if (endDay.toISOString() < response.result[1].result[i]["earliestDeparture"] && response.result[1].result[i]["origin"]["shortName"] == "HOME" && response.result[0].result == null) {
                                                toWork++;

                                            }
                                        }

                                    }


                                }


                            }
                        }
                        if (response.result[0].result == null) {
                            $scope.tomorrow = "From HOME";
                        } else {
                            $scope.tomorrow = "To WORK";
                        }


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


        }

        $scope.loginOther = function () {
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

        }

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


                    if (response.error)
                        alert("ERROR:" + JSON.stringify(response.error));
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

        }

        $scope.http = function () {
            var http = new XMLHttpRequest();
            var url = BASE_URL + "Authentication";
            var params = "";

            http.open("POST", url, true);

//Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");


            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {

                    $(function () {
                        debugger;
                        $scope.loginIE();

                    });
                }
            }
            http.send(params);

        }


        $scope.checkBrowserName = function (name) {
            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf(name.toLowerCase()) > -1) {
                return true;
            }
            return false;
        }


        $(function () {

            $scope.checkBrowser();
        })

        $scope.box.reloadApp($scope.checkBrowser, 3600);

    }];

    var linkFn = function ($scope) {

        // get own instance of config service, $scope.appConfig contains the configuration from the backend
        configService.initialize($scope.appConfig);

        // watch on any changes in the settings screen
        $scope.$watch("appConfig.values", function () {

            $scope.distancefromdestination = $scope.appConfig.values.distancefromdestination;
            $scope.distancefromorigin = $scope.appConfig.values.distancefromorigin;
            $scope.change=$scope.appConfig.values.change;
        }, true);

    };
    return {
        restrict: 'E',
        templateUrl: "app/TwoGo/overview.html",
        controller: directiveController,
        link: linkFn

    };

}]);
