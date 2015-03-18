angular.module("bridge.ticketAppUtils").service("bridge.ticketAppUtils.ticketUtils", function(){
    this.ticketSourceSystems = [{
        urlPart: "bcdmain", name: "BCD"
    }, {
        urlPart: "bctmain", name: "BCT"
    }, {
        urlPart: "bcqmain", name: "BCQ"
    }, {
        urlPart: "bcvmain", name: "BCV"
    }, {
        urlPart: "backup-support", name: "BCP"
    }];

    this.objectToArray = function(object, property) {
        if (angular.isObject(object) && object[property] !== undefined && !angular.isArray(object[property])) {
            var dataCopy = angular.copy(object[property]);
            object[property] = [];
            object[property].push(dataCopy);
        }
    };
});
