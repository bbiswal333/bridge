angular.module('app.imtps').service('app.imtps.msgReaderData', ['$http', '$interval', 'app.imtps.configservice' , 'trafficLightService' , 
                                                                function ($http, $interval, configservice , trafficLightService) {
    var gtpService = 'https://gtpmain.wdf.sap.corp/sap/bc/devdb/msgsfrommytps';
    var nInterval  = 60*5*1000; 
    
    //buckets for the backend tickets
    this.backendTickets = {};
    
    this.loadTicketDataInterval = null;
    this.callbackCollection = null;
    var that = this;
    
    this.loadByTestCaseName = function() {
    	
        $http.get( gtpService + '?testplans=' + configservice.data.tcQuery + '&sap-language=en&origin=' + location.origin//&sap-user=' + that.userid + '&origin=' + location.origin
        ).success(function (data) {
            data = new X2JS().xml_str2json(data);
            that.backendTickets = data.abap.values["TC_MESSAGES"];
                        
            if( that.callbackCollection ){
            	that.callbackCollection(that.backendTickets);	
            }
            
        }).error(function () {
            
        }); 
    };
    
    this.loadByTesterWorklist = function() {
        //this.userid = bridgeDataService.getUserInfo().BNAME.toUpperCase();
        $http.get( gtpService + '?sap-language=en&origin=' + location.origin//&sap-user=' + that.userid + '&origin=' + location.origin
        ).success(function (data) {

            data = new X2JS().xml_str2json(data);
            that.backendTickets = data.abap.values["TC_MESSAGES"];
                                    
            if( that.callbackCollection ){
            	that.callbackCollection(that.backendTickets);	
            }
            
        }).error(function () {
            
        });    	
    };
 

    this.loadTicketData = function () {
    	
    	if( configservice.data.tcQuery ){
    		that.loadByTestCaseName();
    	}else{
    		that.loadByTesterWorklist();
    	}
    	updateTrafficLight();
    };
    
	function updateTrafficLight() {
		
		var prioarray = [0,0,0,0];
		angular.forEach(that.backendTickets["_-QBE_-S_MESSAGES"], function (n) {
			if( n["MSG_PRIO"] == 1 ){
				prioarray[0] = prioarray[0] + 1;
			}else if( n["MSG_PRIO"] == 2 ){
				prioarray[1] = prioarray[1] + 1;
			}else if( n["MSG_PRIO"] == 3 ){
				prioarray[2] = prioarray[2] + 1;
			}else{
				prioarray[3] = prioarray[3] + 1;
			}					
        });
		
		if( prioarray[0] ){
			trafficLightService.red();
		}else if( prioarray[1] ){
			trafficLightService.yellow();
		}else{
			trafficLightService.green();
		}
	}
    
    this.initService = function (sucessCallback) {
    	that.callbackCollection = sucessCallback;
    	if( !that.loadTicketDataInterval ){
    		that.loadTicketDataInterval = $interval(this.loadTicketData, nInterval);
    		this.loadTicketData();
    	}else{
    		if( that.callbackCollection ){
            	that.callbackCollection(that.backendTickets);	
            }
    	}
    };
}]);