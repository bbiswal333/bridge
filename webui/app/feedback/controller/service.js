/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').service('feedback', function () {
    var question = "";

    this.setQuestion = function (sQ) {
        question = sQ.question;
    };
    this.getQuestion = function (gQ) {
        gQ.question = question;
    };
});