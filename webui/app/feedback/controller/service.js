/**
 * Created by D062653 on 29.06.2015.
 */
angular.module('app.feedback').service('feedback', function () {
    var question ="test";
    var id = 0;

    this.setQuestion = function (sQ) {
        question = sQ.question;
        id = sQ.qId;
    };
   this.getQuestion = function (gQ) {
        gQ.question = question;
        gQ.question_id = id;
       return question;
    };

    this.values = {
        anonym: true
    };

});