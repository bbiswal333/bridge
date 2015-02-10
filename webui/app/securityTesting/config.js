angular.module('app.securityTesting').service("app.securityTesting.configservice", function () {

    var instances = {};

    this.getConfigInstanceForAppId = function (appId) {
        if (instances[appId] === undefined) {
            instances[appId] = {
                fortifyfilter : {objectid: '', objecttype: ''},
                filters : [],
                auth: true
            };
        }

        return instances[appId];
    };

});
