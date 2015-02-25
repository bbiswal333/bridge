angular.module("bridge.ticketAppUtils").service("bridge.ticketAppUtils.detailUtils", function(){
    this.ticketMatches = function(oTicket, sFilterString, aPrios){
        var bTicketPriorityMatches = false;
        angular.forEach(aPrios, function(prio){
            if (prio.active === true && oTicket.PRIORITY_KEY === prio.key){
                bTicketPriorityMatches = true;
            }
        });

        var bTicketContainsFilterString = false;
        if (sFilterString === "" || sFilterString === undefined){
            bTicketContainsFilterString = true;
        } else {
            var property;
            for (property in oTicket){
                if (oTicket[property].toString().toUpperCase().indexOf(sFilterString.toUpperCase()) !== -1){
                    bTicketContainsFilterString = true;
                }
            }
        }

        return bTicketPriorityMatches && bTicketContainsFilterString;
    };

});
