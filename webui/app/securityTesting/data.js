angular.module("app.securityTesting.data", [])
	.service("app.securityTesting.dataService", ["$http", "$q",
	function ($http, $q) {
		    this.data = {};
		    this.data.transportData = {};
		    this.data.fortifyResults = 0;
            this.data.coverityResults = 0;
            this.data.auth = false;

            var Base64 = {

                // private property
                _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-=",

                // public method for encoding
                encode : function (input) {
                    var output = "";
                    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                    var i = 0;

                    input = Base64._utf8_encode(input);

                    while (i < input.length) {

                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }

                        output = output +
                        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

                    }

                    return output;
                },

                // public method for decoding
                decode : function (input) {
                    var output = "";
                    var chr1, chr2, chr3;
                    var enc1, enc2, enc3, enc4;
                    var i = 0;

                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                    while (i < input.length) {

                        enc1 = this._keyStr.indexOf(input.charAt(i++));
                        enc2 = this._keyStr.indexOf(input.charAt(i++));
                        enc3 = this._keyStr.indexOf(input.charAt(i++));
                        enc4 = this._keyStr.indexOf(input.charAt(i++));

                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;

                        output = output + String.fromCharCode(chr1);

                        if (enc3 !== 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 !== 64) {
                            output = output + String.fromCharCode(chr3);
                        }

                    }

                    output = Base64._utf8_decode(output);

                    return output;

                },

                // private method for UTF-8 encoding
                _utf8_encode : function (string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";

                    for (var n = 0; n < string.length; n++) {

                        var c = string.charCodeAt(n);

                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        }
                        else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }

                    }

                    return utftext;
                },

                // private method for UTF-8 decoding
                _utf8_decode : function (utftext) {
                    var string = "";
                    var i = 0;
                    var c, c2, c3;
                    c = c2 = c3 = 0;

                    while (i < utftext.length) {

                        c = utftext.charCodeAt(i);

                        if (c < 128) {
                            string += String.fromCharCode(c);
                            i++;
                        }
                        else if ((c > 191) && (c < 224)) {
                            c2 = utftext.charCodeAt(i + 1);
                            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                            i += 2;
                        }
                        else {
                            c2 = utftext.charCodeAt(i + 1);
                            c3 = utftext.charCodeAt(i + 2);
                            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            i += 3;
                        }

                    }

                    return string;
                }
            };

            this.getAuthorised = function () {

                var url = 'https://pulsecsi.mo.sap.corp:1443/authorisation/dashboards.bridge';
                var deferred = $q.defer();
                var that = this;
                $http.get(url, { withCredentials: false }).success(function (data) {

                    if (data.data[0]) {
                        that.data.auth = true;
                    }
                    else {
                        that.data.auth = false;
                    }

                    deferred.resolve();
                });
                return deferred.promise;
            };

            this.loadData = function (config) {
                var sendcrit = Base64.encode(JSON.stringify(config));
                var deferred = $q.defer();
                var url = 'https://pulsecsi.mo.sap.corp:1443/results/count/' + sendcrit;
                var that = this;
                $http.get(url, { withCredentials: false }).success(function (data) {
                    that.data.securityTestingData = data.count;
                    deferred.resolve();
                });
                return deferred.promise;
            };

            this.loadDataDetailed = function (system,config) {
                var deferred = $q.defer();
                var sendcrit = Base64.encode(JSON.stringify(config));
                var url = 'https://pulsecsi.mo.sap.corp:1443/results/detail/' + system + "/" + sendcrit;
                var that = this;
                $http.get(url, { withCredentials: false }).success(function (data) {
                    that.data.securityTestingDetail = data.details;
                    deferred.resolve();
                });
                return deferred.promise;
            };

        }]);
