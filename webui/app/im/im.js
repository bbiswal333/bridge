// Vorarbeit für Datenkapselung - momentan nutzlos

var Iim = {getMessageforQuery : function(query) { throw "Not Implemented" }
};
var im = function(http){
    this.http = http;
};

im.prototype = Object.create(Iim);


im.prototype.getMessageforQuery = function (query, scope) {
    scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
    this.http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp/sap/bc/devdb/MYINTERNALMESS' )
        ).success(function(data) {
            scope.imData = data;

            var i=0;
            

            scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

        }).error(function(data) {
            scope.imData = [];
            scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
        });
};

        angular.module('app.im').factory('im', ['$http',
   function ($http) {
       return new im($http);
   }]);
