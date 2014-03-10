angular.module('app.links').factory("app.links.linkData", function () {

	//Get all the links
	var linkList = [{'name': 'Google','url':'http://google.de','cat':'General'},{'name': 'SAP','url':'http://sap.de', 'cat':'General'}];

	return linkList;


});