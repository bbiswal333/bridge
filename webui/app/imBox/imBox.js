var IimBox = {getMessageforQuery : function(query) { throw "Not Implemented" }
};
var imBox = function(http){
    this.http = http;
};

imBox.prototype = Object.create(IimBox);


imBox.prototype.getMessageforQuery = function (query, scope) {
    scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
    this.http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp/sap/bc/devdb/MYINTERNALMESS?format=json' + query)
        ).success(function(data) {
            scope.imData = data;

            scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

        }).error(function(data) {
            scope.imData = [];
            scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
        });
};

        imBoxApp.factory('imBox', ['$http',
   function ($http) {
       return new imBox($http);
   }]);
