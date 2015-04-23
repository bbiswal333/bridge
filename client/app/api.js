var setHeader	= require('./cors.js'),
    EWSClient 	= require("./ews/ewsClient.js").EWSClient,
    path        = require("path");

exports.register = function(app) {
    var pathTrafLight = path.join( __dirname , 'trafficlight');

    // generic api call get
    app.get('/api/get', function (request, response) {
        webkitClient.jQuery.ajax({
            url: request.query.url,
            type: "GET",
            success: function (data) {
                response.send(data);
            },
            error: function () {
                response.send("error calling " + request.query.url);
            }
        });
    });

    //generic api call post with options
    app.options("/api/post", function(request, response){
        response = setHeader( request, response );
        response.send();
        return;
    });

    app.post("/api/post", function (request, response) {
        if (typeof request.query.url === "undefined" || request.query.url === ""){
            response = setHeader( request, response );
            response.send("Paramter url needs to be set!");
            return;
        }

        var service_url = url.parse(request.query.url);
        var postData = JSON.stringify(request.body);

        webkitClient.jQuery.ajax({
            url: service_url,
            type: "POST",
            data: postData,
            success: function (data) {
                response.send(data);
            },
            error: function () {
                response.send("error calling " + request.query.url);
            }
        });
    });

    app.get('/api/client/copy', function (request, response) {
        webkitClient.gui.Clipboard.get().set(request.query.text);
        response.send("done");
    });

    app.get('/client', function (request, response) {
        response = setHeader( request, response );
        response.send('{"client":"true", "os": "' + process.platform + '", "version": "' + webkitClient.gui.App.manifest.version + '"}');
    });

    app.get("/api/trafficLight" , function (request, response) {
        /*
         traffic light command api parameters:
         turn off (0 is the number 0)
         1 turn on
         R turn on red traffic light
         Y turn on yellow traffic light
         G turn on green traffic light
         O turn off all traffic light
         -# switch when the device consists of multiple switches, choose this one, first=0
         -i nnn interval test, turn the device on and off, time interval nnn ms, in an endless loop
         -I nnn interval test, turn on, wait nnn ms and turn off
         -p t1 .. tn pulse mode, the switch will be turned on for 0.5 seconds then t1 seconds paused, turned on 0.5 s and t2 s pause, etc. after processing the last argument the switch turns off and the program terminates.
         */
        var colorOn = request.query.color;

        var l_err = '';
        if(process.platform === "win32") {
            var child = execFile('USBswitchCmd.exe', [ colorOn ] , { cwd: pathTrafLight } , function( error, stdout, stderr) {
                // callback function for switch
                if ( error ) {
                    // print error
                    console.log(stderr);
                    l_err = stderr;
                    // error handling & exit
                }
            });
        }

        response = setHeader( request, response );
        response.send('{"msg":"' + l_err + '"}');
    });

    app.get("/api/calDataSSO", function (request, response) {
        response = setHeader( request, response );
        var json = function () {
            if (typeof request.query.format !== "undefined") {
                return (request.query.format.toLowerCase() === "json") ? true : false;
            }
        }();

        var ews;
        try {
            // we want to have business logic, iff at all in the api.js and not ewsclient.js
            var dateFrom = request.query.dateFrom;
            var dateTo = request.query.dateTo;
            if (dateFrom === undefined || dateTo === undefined) {
                throw new Error("dateFrom_s and dateTo_s must not be undefined.");
            }

            if (dateFrom === "" || dateTo === "") {
                throw new Error("dateFrom_s and dateTo_s must not ne empty.");
            }

            if (dateFrom.length !== 20 || dateTo.length !== 20) {
                throw new Error("dateFrom_s and dateTo_s must follow the scheme \"YYYY-MM-DDTHH:MM:SSZ\", e.g. \"1789-08-04T23:59:00Z\"");
            }

            ews = new EWSClient("calview", request.query, json);
        } catch (e) {
            var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
            console.log(ans);
            response.send(ans);
            return;
        }

        ews.doRequest(function (res) {
            if (res instanceof Error) {
                var ans = "EWS-request resulted in an error:\n" + res.toString();
                console.log(ans);
                response.send(ans);
            }
            else {
                if (json) {
                    response.setHeader('Content-Type', 'application/json');
                }
                response.send(res);
            }
        });

    });

    app.get("/api/calGetItemSSO", function (request, response) {
        response = setHeader( request, response );
        var json = function () {
            if (typeof request.query.format !== "undefined") {
                return (request.query.format.toLowerCase() === "json") ? true : false;
            }
        }();

        var ews;
        try {
            ews = new EWSClient("getitem", request.query, json);
        } catch (e) {
            var ans = "Initialization of EWSClient resulted in an error:\n" + e.toString();
            console.log(ans);
            response.send(ans);
            return;
        }

        ews.doRequest(function (res) {
            if (res instanceof Error) {
                var ans = "EWS-request resulted in an error:\n" + res.toString();
                console.log(ans);
                response.send(ans);
            }
            else {
                if (json) {
                    response.setHeader('Content-Type', 'application/json');
                }
                response.send(res);
            }
        });

    });
}