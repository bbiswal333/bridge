angular.module('app.linklist').service("app.linklist.configservice", function () {

    this.data = {
        version: 1, 
        listCollection: []
    };

	this.generateBlob =  function(name,sid,transaction,parameters) {
        var data = "[System] \n" +
                   "Name=" + sid + " \n" +
                   "Client= \n" +
                   "[User] \n" +
                   "[Function] \n" +
                   "Command=" + transaction + " " + parameters + " \n";

        var blob = new Blob([data]);
        var saplink = {};
        saplink.objectURL = window.URL.createObjectURL(blob);
        saplink.name = name;
        saplink.download = saplink.name + ".sap";
        return saplink; 
    };
});
