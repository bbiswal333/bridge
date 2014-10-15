/**
 * Created by D062081 on 13.08.2014.
 */
/**
 * Utils
 */
var siriusUtils = function () {

    this.adjustURLForRunningEnvironment = function(){
        return 'https://ifp.wdf.sap.corp/zprs/json';
    };

    this.adjustURLForExternalSiriusApp = function(){
        return 'https://ifp.wdf.sap.corp/prs';
    };

    this.DEV_SERVER_URL = function(){
        return 'https://ifd.wdf.sap.corp:443';
    };

    this.OLD_PR_URL = function(){
        return 'https://ifp.wdf.sap.corp:443/sap/bc/bsp/sap/zpr/default.htm?sap-syscmd=nocookie&iv_prg_id=';
    };

    this.PROD_SERVER_HOST = function(){
        return 'ifp.wdf.sap.corp';
    };

    this.SiriusObject = function () {
        this.WORKING_STATE = null;
        this.LOAD_STATE = null;
    };

    this.createDate = function (dateString) {
        var date = null;
        if (dateString === '0000-00-00' ) {
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

    return this;
}();
