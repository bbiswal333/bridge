/**
 * Created by D062081 on 13.08.2014.
 */
/**
 * Utils
 */

angular.module('app.sirius')
    .factory('app.sirius.utils', function () {

        var _urlforRunningEnv = 'https://ifd.wdf.sap.corp/zprs/json';
        var _urlforExtSiriusApp = 'https://ifd.wdf.sap.corp/prs';
        var _urlDevServer = 'https://ifd.wdf.sap.corp:443';
        var _urlOldPR = 'https://ifd.wdf.sap.corp:443/sap/bc/bsp/sap/zpr/default.htm?sap-syscmd=nocookie&iv_prg_id=';
        var _hostProdServer = 'ifd.wdf.sap.corp';
        var _siriusObject = function () {
            this.WORKING_STATE = null;
            this.LOAD_STATE = null;
        };


        var _adjustURLForRunningEnvironment = function () {
            return _urlforRunningEnv;
        };
        var _adjustURLForExternalSiriusApp = function () {
            return _urlforExtSiriusApp;
        };
        var _dev_server_url = function () {
            return _urlDevServer;
        };
        var _old_pr_url = function () {
            return _urlOldPR;
        };
        var _prod_server_host = function () {
            return _hostProdServer;
        };
        var _SiriusObject = function () {
            return _siriusObject;
        };
        var _createDate = function (dateString) {
            var date = null;
            if (dateString === '0000-00-00') {
                return date;
            } else {
                try {
                    date = new Date(dateString);
                    date = date.getDay() + "." + date.getMonth() + "." + date.getFullYear();

                } catch (e) {
                    date = null;
                }
            }
            return date;
        };


        return {
            adjustURLForRunningEnvironment: _adjustURLForRunningEnvironment,
            adjustURLForExternalSiriusApp: _adjustURLForExternalSiriusApp,
            dev_server_url: _dev_server_url,
            old_pr_url: _old_pr_url,
            prod_server_host: _prod_server_host,
            SiriusObject: _SiriusObject,
            createDate: _createDate
        };


//        var _siriusUtils = function () {
//
//            this.adjustURLForRunningEnvironment = function () {
//                return 'https://ifp.wdf.sap.corp/zprs/json';
//            };
//
//            this.adjustURLForExternalSiriusApp = function () {
//                return 'https://ifp.wdf.sap.corp/prs';
//            };
//
//            this.dev_server_url = function () {
//                return 'https://ifd.wdf.sap.corp:443';
//            };
//
//            this.old_pr_url = function () {
//                return 'https://ifp.wdf.sap.corp:443/sap/bc/bsp/sap/zpr/default.htm?sap-syscmd=nocookie&iv_prg_id=';
//            };
//
//            this.prod_server_host = function () {
//                return 'ifp.wdf.sap.corp';
//            };
//
//            this.SiriusObject = function () {
//                this.WORKING_STATE = null;
//                this.LOAD_STATE = null;
//            };
//
//            this.createDate = function (dateString) {
//                var date = null;
//                if (dateString === '0000-00-00') {
//                    return date;
//                } else {
//                    try {
//                        date = new Date(dateString);
//                        date = date.getDay() + "." + date.getMonth() + "." + date.getFullYear();
//
//                    } catch (e) {
//                        date = null;
//                    }
//                }
//                return date;
//            };
//
//            return this;
//        };

    });
