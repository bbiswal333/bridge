/**
 * Created by D062081 on 13.08.2014.
 */
/**
 * Utils
 */
var siriusUtils = function () {

    this.adjustURLForRunningEnvironment=function(){
        return 'https://ifd.wdf.sap.corp/zprs/json';
    };
    this.OLD_PR_URL=function(){
        return "https://ifd.wdf.sap.corp:443/sap/bc/bsp/sap/zpr/default.htm?sap-syscmd=nocookie&iv_prg_id=";
    };

    this.SiriusObject = function () {
        this.WORKING_STATE = null;
        this.LOAD_STATE = null;
    };
    return this;


}();



