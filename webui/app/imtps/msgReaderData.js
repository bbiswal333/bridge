angular.module('app.imtps').service('app.imtps.msgReaderData', ['$http', '$interval', 'app.im.configservice', function ($http, $interval, configservice) {
    var gtpService = 'https://gtpmain.wdf.sap.corp/sap/bc/devdb/msgsfrommytps';
    
    //buckets for the backend tickets
    this.backendTickets = {};
    
    this.loadTicketDataInterval = null;
    this.callbackCollection = null;
    var that = this;
    
    this.loadByTestCaseName = function() {
        $http.get( gtpService + '?testplans=' + configservice.tcQuery + '&sap-language=en&origin=' + location.origin//&sap-user=' + that.userid + '&origin=' + location.origin
        ).success(function (data) {

            data = new X2JS().xml_str2json(data);
            that.backendTickets = data.abap.values;
                        
            if( that.callbackCollection ){
            	that.callbackCollection(this.backendTickets);	
            }
            
        }).error(function () {
            
        }); 
    };
    
    this.loadByTesterWorklist = function() {
        //this.userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();
        $http.get( gtpService + '?sap-language=en&origin=' + location.origin//&sap-user=' + that.userid + '&origin=' + location.origin
        ).success(function (data) {

            data = new X2JS().xml_str2json(data);
            that.backendTickets = data.abap.values;
                                    
            if( that.callbackCollection ){
            	that.callbackCollection(this.backendTickets);	
            }
            
        }).error(function () {
            
        });    	
    };
 

    this.loadTicketData = function () {
    	if( configservice.tcQuery ){
    		that.loadByTestCaseName();
    	}else{
    		that.loadByTesterWorklist();
    	}

    };
    
    this.initService = function (sucessCallback) {
    	that.callbackCollection = sucessCallback;
    	if( !that.loadTicketDataInterval ){
    		that.loadTicketDataInterval = $interval(this.loadTicketData, 1000);
    	}
    };
}]);