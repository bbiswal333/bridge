/*
    This file is the equivalent to the (untested) loader.js. While loader js does the bootstrapping in the productive environment we do the same here for our testing. We cannot just execute the loader.js
    in the testenvironment, because it relies on the list of available apps etc.
*/

angular.module('bridge.app', []);
angular.module('bridge.service', []);
angular.module('bridge.service').provider("bridge.service.loader", function () {
    this.apps = [{
        icon_css: "icon-wrench",
        module_name: "app.atc",
        needs_client: false,
        overview_directive: "app.atc",
        routes: null,
        title: "ATC Results"
    }, {
        icon_css: "icon-clock-o",
        module_name: "app.cats",
        needs_client: false,
        overview_directive: "app.cats",
        routes: null,
        title: "CATS Compliance"
    }];
    this.$get = function () { return this; };
});