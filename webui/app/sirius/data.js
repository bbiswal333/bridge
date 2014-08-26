angular.module('app.sirius')
    .filter('oldProgramSign', [function () {
        return function (isOldProgram) {
            return (isOldProgram === 'X') ? "(from Program Repository)" : "";
        };
    }])
    .service('app.sirius.dataservice', ["$http", function ($http) {

    // Search as-you-type on type ahead
    this.startSearchAsYouType = function ($scope) {
        var searchString=$scope.searchString;
        return $http.get(siriusUtils.adjustURLForRunningEnvironment()+'/program?maxHits=50&query='+searchString+'&sap-language=en').then(function (response)  {
            var programs=[];
            programs=response.data.data;
            programs.sort(_sortProgs);
            programs.forEach(function(program) {
                program.DISPLAY_TEXT += ' ' + $filter('oldProgramSign')(program.IS_OLD_PROGRAM);
            });

            return programs;
        });
    };
        var _sortProgs = function(a,b){
            if (a.DISPLAY_TEXT.toLowerCase() < b.DISPLAY_TEXT.toLowerCase()) {return -1;}
            if (a.DISPLAY_TEXT.toLowerCase() > b.DISPLAY_TEXT.toLowerCase()) {return 1;}
            return 0;
        };
}]);
