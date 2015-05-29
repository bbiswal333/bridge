/**
 * Created by D059391 on 27.05.2015.
 */
angular.module("app.TwoGo.data", []).service("app.TwoGo.dataService", function () {



var arrayToday;
    var arrayTomorrow;
    var arrayTomorrowH;
    var whichLinkClicked;
    var v=[];

 this.setArrayToday = function (array1) {

        arrayToday=array1;


    };
  this.setArrayTomorrow = function (array2) {

        arrayTomorrow=array2;


    };
   this.setArrayTomorrowH = function (array3) {

        arrayTomorrowH=array3;


    };
    this.getArrayToday = function () {

        return arrayToday;


    };
    this.getArrayTomorrow = function () {

       return arrayTomorrow;


    };
    this.getArrayTomorrowH = function () {

    return arrayTomorrowH;


    };

    this.setWhichLinkClicked = function (i) {

        whichLinkClicked=i;


    };
    this.getWhichLinkClicked = function () {

        return whichLinkClicked;


    };
    this.setPv = function(){
        v.push("pv");
    };
    this.setDv = function(){
v.push("dv");
    };
    this.setBoth = function(){
        v.push("both")
    };
    this.getV = function() {
        return v;
    };


});