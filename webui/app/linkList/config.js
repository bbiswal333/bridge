angular.module('app.linkList').factory("app.linkList.configservice", function () {

	var configItem = {
		linkList: [],
		cats: ["blue","red","yellow"]
	};
	return configItem; 
});

