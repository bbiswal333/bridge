angular.module('app.linkList').factory("app.linkList.configservice", function () {

	var configItem = {
		version: 1, 
		listCollection: [],
		/*linkList: [],
		linkList2: [],*/

		generateBlob:  function(name,sid,transaction,parameters)
		                {
		                     data =     "[System] \n"+
		                                "Name="+sid+" \n"+
		                                "Client= \n"+
		                                "[User] \n"+
		                                "[Function] \n"+
		                                "Command="+transaction+" \n";

		                    var blob = new Blob([data]);
		                    var saplink = {};
		                        saplink.objectURL = window.URL.createObjectURL(blob);                 
		                        saplink.name = name;
		                        saplink.download =  saplink.name+".sap";
		                    return saplink; 
		                }//generateBlob
	};



	return configItem; 
});

