angular.module('bridge.service').service('bridge.converter', [ function() {
    this.getDateFromAbapTimeString = function(sAbapDate){
        return new Date(Date.UTC(parseInt(sAbapDate.substring(0,4)), parseInt(sAbapDate.substring(4,6)) - 1, parseInt(sAbapDate.substring(6,8)), parseInt(sAbapDate.substring(8,10)),
            parseInt(sAbapDate.substring(10,12)), parseInt(sAbapDate.substring(12,14))));
    };
}]);
