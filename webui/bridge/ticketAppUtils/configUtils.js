angular.module("bridge.ticketAppUtils", ["mgcrea.ngStrap.popover"]);
angular.module("bridge.ticketAppUtils").service("bridge.ticketAppUtils.configUtils", ['$popover', function($popover){

    this.applyBackendConfig = function(oTarget, oBackendConfig){
        var property;

        for (property in oBackendConfig) {
            if (property === "columnVisibility" && oTarget.columnVisibility.length !== oBackendConfig.columnVisibility.length) {
                // if the length of the columnVisibility attribute changed, reset to default. This happens for example if a new column is introduced
                continue;
            } else {
                oTarget[property] = oBackendConfig[property];
            }
        }
    };

    this.goToTicketButtonConfig = {
        iconCss: "fa-eye",
        title: "View Ticket in new Tab",
        callback: function (eventClick) {
            var myPopover = $popover(angular.element(eventClick.currentTarget), {
                template: 'bridge/ticketAppUtils/enterIncidentTemplate.html',
                trigger: 'manual',
                placement: 'right'
            });
            myPopover.$promise.then(function () {
                myPopover.show();
            });
        }
    };

}]);
