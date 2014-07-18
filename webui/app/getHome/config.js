angular.module('app.getHome').service("app.getHome.configservice", function () {

	this.data = {
		version: 1, 
		locations: [ {
			name : "Work",
			address : "Dietmar-Hopp-Allee, Walldorf",
			latitude : 49.30289,
			longitude : 8.64298
		}, {
			name : "Home",
			address : "Kaiserstraße, Karlsruhe",
			latitude : 49.009079,
			longitude : 8.4165401
		} ]
	};

});
