// Vorarbeit für Datenkapselung - momentan nutzlos

var Iimtl = {getMessageforQuery : function(query) { throw "Not Implemented" }
};
var imtl = function(http){
    this.http = http;
};

imtl.prototype = Object.create(Iimtl);


imtl.prototype.getMessageforQuery = function (query, scope) {
    scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
    this.http.get('/api/get?url=' + encodeURI('https://css.wdf.sap.corp/sap/bc/devdb/MYINTERNALMESS' )
        ).success(function(data) {
            scope.imData = data;

            var i=0;
            

            scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

        }).error(function(data) {
            scope.imData = [];
            scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
        });
};

        angular.module('app.imtl').factory('imtl', ['$http',
   function ($http) {
       return new imtl($http);
   }]);
