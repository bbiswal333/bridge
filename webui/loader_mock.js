/*
    This file is the equivalent to the (untested) loader.js. While loader.js does the bootstrapping in the productive environment we do the same here for our testing. We cannot just execute the loader.js
    in the test environment, because it relies on the list of available apps etc.
    Basically we need to instantiate all modules etc. here that we instantiate in the loader.js in the productive environment.
*/

angular.module('bridge.app', [
    "ngRoute",
    "bridge.service",
    "lib.utils",
    "bridge.diagnosis"
]);

angular.module('bridge.service', []);
angular.module('bridge.service').provider("bridge.service.loader", function () {
    this.apps = [{
        icon_css: "icon-wrench",
        module_name: "app.atc",
        needs_client: false,
        overview_directive: "app.atc",
        routes:
		[
			{		
			    "route"			:	"/detail/atc/:appId/:prio",
			    "templateUrl"	:	"app/atc/detail.html"			
			}
		],
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