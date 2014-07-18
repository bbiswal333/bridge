var path    = require('path');
var fs      = require("fs");
var xml2js  = require('xml2js').parseString;

/*
    list of available fields to request from ews
    http://msdn.microsoft.com/en-us/library/office/aa494315(v=exchg.150).aspx
*/

exports.EWSClient = function(dateFrom, dateTo, json) {
    var EWS_URI = "https://mymailwdf.global.corp.sap/ews/exchange.asmx";
    var SOAP_TEMPLATE_FILE = path.join(__dirname, "/") + "exchange_soap_template.xml";    
    var PLACEHOLDER_FROM = "%DATEFROM%";
    var PLACEHOLDER_TO = "%DATETO%";    
    var ERR_MSG_CONNECTION_TO_EXCHANGE = "An error occured during request to the Microsoft Exchange server.";    
    
    if (dateFrom == undefined || dateTo == undefined) {
        throw new Error("dateFrom_s and dateTo_s must not be undefined.");
    }

    if (dateFrom == "" || dateTo == "") {
        throw new Error("dateFrom_s and dateTo_s must not ne empty.");
    }

    if (dateFrom.length != 20 || dateTo.length != 20) {
        throw new Error("dateFrom_s and dateTo_s must follow the scheme \"YYYY-MM-DDTHH:MM:SSZ\", e.g. \"1789-08-04T23:59:00Z\"");
    }
    
    this.doRequest = function(callback_fn) {
        readSoapTemplate(function(data) {
            data = data.replace(PLACEHOLDER_FROM, dateFrom);
            data = data.replace(PLACEHOLDER_TO, dateTo);
            
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
    /*
    {type:"roomsearch", searchString:"" 
    */
