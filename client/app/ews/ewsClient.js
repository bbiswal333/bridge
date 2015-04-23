var path    = require('path');
var fs      = require("fs");
var xml2js  = require('xml2js').parseString;
var _und 	= require('underscore')._;

/*
    list of available fields to request from ews
    http://msdn.microsoft.com/en-us/library/office/aa494315(v=exchg.150).aspx
*/

exports.EWSClient = function(clientType, query2, json) {
    var EWS_URI = "https://mymailwdf.global.corp.sap/ews/exchange.asmx";
    var SOAP_TEMPLATE_FILE;
    var ERR_MSG_CONNECTION_TO_EXCHANGE = "An error occured during request to the Microsoft Exchange server.";    
    
	// need to copy the value due to race condition
	var query = clone(query2);

	if (typeof clientType == "undefined" ) {
		throw new Error("Client-Type needs to be set");
	}
				
	SOAP_TEMPLATE_FILE = path.join(__dirname, "/") + "exchange_soap_"+clientType+"_template.xml";    

    this.doRequest = function(callback_fn) {
        readSoapTemplate(function(data) {
            
           try {
               var compiled = _und.template(data);
               data = compiled(query);
           } catch (err) {
               var text = "Error applying template. Please check if every needed variable is set.\n"+ err;
               callback_fn(new Error(text + " " + ERR_MSG_CONNECTION_TO_EXCHANGE));
               console.log('3' + text);
           }
            
            var myresult;

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


            function handleData(ews_xml) {
                if (json) {
                    try {
                        xml2js(ews_xml, function(err, result) {                            
                            if (err == undefined) {
                                callback_fn(JSON.stringify(result));
                            } else {
                                callback_fn(new Error("handleData cb => "+ERR_MSG_CONNECTION_TO_EXCHANGE));
                            }
                        });
                    } catch (err) {
                        var text = "Error parsing JSON. Please try again requesting XML."
                        callback_fn(new Error("handleData catch => " + ERR_MSG_CONNECTION_TO_EXCHANGE));
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
	//Clones an object
	function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
    	var copy = {} // obj.constructor();
    	for (var attr in obj) {
        	copy[attr] = obj[attr];
		}
    	return copy;
}


};
