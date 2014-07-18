angular.module('app.getHome').service("app.getHome.configservice", function () {

	this.data = {
		version: 1, 
		locations: [ {
			name : "Work",
			address : "Dietmar-Hopp-Allee, Walldorf",
			lat : "10",
			alt : "48"
		}, {
			name : "Home",
			address : "Kaiserstraße, Karlsruhe",
			lat : "9",
			alt : "49"
		} ]
	};

});
