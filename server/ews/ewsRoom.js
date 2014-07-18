var path    = require('path');
var fs      = require("fs");
var xml2js  = require('xml2js').parseString;
var _und 	= require('underscore')._;

/*
    list of available fields to request from ews
    http://msdn.microsoft.com/en-us/library/office/aa494315(v=exchg.150).aspx
*/

exports.EWSRoom = function(desc, json) {
    var EWS_URI = "https://mymailwdf.global.corp.sap/ews/exchange.asmx";
    var SOAP_TEMPLATE_FILE = path.join(__dirname, "/") + "exchange_soap_roomsearch_pop.xml";    
   
    var ERR_MSG_CONNECTION_TO_EXCHANGE = "An error occured during request to the Microsoft Exchange server.";    
    
   
    
    this.doRequest = function(callback_fn) {
        readSoapTemplate(function(data) {
			
			var compiled = _und.template(data)
			data = compiled({roomSearchString: roomSearchString});
	
            console.log(data);
            if (typeof webkitClient !== 'undefined' && webkitClient)
            {                

                webkitClient.jQuery.ajax({
                    url: EWS_URI, 
                    type: "POST",
                    dataType: "xml", 
                    data: data, 
                    processData: false,
                    contentType: "text/xml; charset=\"utf-8\"",
                    success: 
                        function(data)
                        {               
                            console.log("Success");
                            console.log(data);
                            handleData(data.children[0].childNodes[1].innerHTML);
                        },
                    error: 
                        function() {
                            console.log('6' + ERR_MSG_CONNECTION_TO_EXCHANGE);
                            callback_fn(new Error(ERR_MSG_CONNECTION_TO_EXCHANGE));                            
                        }
                });

            }        

            function handleData(ews_xml) {
                if (json) {
                    try {
                        xml2js(ews_xml, function(err, result) {                            
                            if (err == undefined) {
                                callback_fn(JSON.stringify(result));
                            } else {
                                callback_fn(new Error(ERR_MSG_CONNECTION_TO_EXCHANGE));
                            }
                        });
                    } catch (err) {
                        var text = "Error parsing JSON. Please try again requesting XML."
                        callback_fn(new Error(ERR_MSG_CONNECTION_TO_EXCHANGE));
                        console.log('3' + text);
                    }
                } else {
                    callback_fn(ews_xml);
                }
            }
        });
    };
    
        function readSoapTemplate(callback_fn) {
        var readStream = fs.createReadStream(SOAP_TEMPLATE_FILE);
        var data = "";

        readStream.setEncoding('utf8');
        readStream.on('data', function(chunk) {
            data += chunk;
        });
        readStream.on("end", function() {
            callback_fn(data);
        });
    }
};
    /*
    {type:"roomsearch", searchString:"" 
    */

    exports.EWSRoomListClient = function(query, json) {
    var EWS_URI = "https://mymailwdf.global.corp.sap/ews/exchange.asmx";
    var SOAP_TEMPLATE_FILE =  path.join(__dirname, "/") + "exchange_soap_roomsearch_pop.xml";
    
    var ERR_MSG_CONNECTION_TO_EXCHANGE = "An error occured during request to the Microsoft Exchange server.";    

    //var queryType = "";
    //var prepareData;
        
       /* switch(query.type){
            case "roomsearch":
                {
                    queryType = "roomsearch";
                    var PLACEHOLDER_ROOM = "%ROOMID%";
                    SOAP_TEMPLATE_FILE = path.join(__dirname, "/") + "exchange_soap_roomsearch_populated.xml";
                    prepareData = function(data) {
                        data = data.replace(PLACEHOLDER_ROOM, query.building);
                        return data;
                    }
                }
                break;
            default:
                {}
        }*/
        
    
    this.doRequest = function(callback_fn) {
        readSoapTemplate(function(data) {
            
            //data = prepareData(data);
            
            if (typeof webkitClient !== 'undefined' && webkitClient)
            {                

                webkitClient.jQuery.ajax({
                    url: EWS_URI, 
                    type: "POST",
                    dataType: "xml", 
                    data: data, 
                    processData: false,
                    contentType: "text/xml; charset=\"utf-8\"",
                    success: 
                        function(data)
                        {                                        
                            handleData(data.children[0].childNodes[1].innerHTML);
                        },
                    error: 
                        function() {
                            console.log('6' + ERR_MSG_CONNECTION_TO_EXCHANGE);
                            callback_fn(new Error(ERR_MSG_CONNECTION_TO_EXCHANGE));                            
                        }
                });

            }        

            function handleData(ews_xml) {
                if (json) {
                    try {
                        xml2js(ews_xml, function(err, result) {                            
                            if (err == undefined) {
                                callback_fn(JSON.stringify(result));
                            } else {
                                callback_fn(new Error(ERR_MSG_CONNECTION_TO_EXCHANGE));
                            }
                        });
                    } catch (err) {
                        var text = "Error parsing JSON. Please try again requesting XML."
                        callback_fn(new Error(ERR_MSG_CONNECTION_TO_EXCHANGE));
                        console.log('3' + text);
                    }
                } else {
                    callback_fn(ews_xml);
                }
            }
        });
    };
    
    function readSoapTemplate(callback_fn) {
        var readStream = fs.createReadStream(SOAP_TEMPLATE_FILE);
        var data = "";

        readStream.setEncoding('utf8');
        readStream.on('data', function(chunk) {
            data += chunk;
        });
        readStream.on("end", function() {
            callback_fn(data);
        });
    }
};
