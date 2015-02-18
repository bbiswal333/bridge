describe("The premiumEngagement settings controller", function(){
    var $controller,
        $rootScope,
        config,
        ticketData;

    beforeEach(function(){
        module("app.premiumEngagement");

        inject(function(_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;

            $rootScope.boxScope = {
                metadata: {
                    guid: "testDummy"
                }
            };
        });

        inject(["app.premiumEngagement.configService", "app.premiumEngagement.ticketData", function(configService, ticketDataService){
            config = configService.getInstanceForAppId($rootScope.boxScope.metadata.guid);
            ticketData = ticketDataService.getInstanceForAppId($rootScope.boxScope.metadata.guid);
        }]);

        spyOn(ticketData, "loadTicketData");
    });

    it("should add the current customerId to the list of configured customers on click", function(){
        $controller("app.premiumEngagement.settingsController", {
            "$scope": $rootScope
        });

        $rootScope.addCustomer("12345");
        expect(config.data.aConfiguredCustomers.length).toBe(1);
        expect(config.data.aConfiguredCustomers[0]).toBe("12345");
    });

    it("should not be able to add duplicate customers", function(){
        $controller("app.premiumEngagement.settingsController", {
            "$scope": $rootScope
        });

        $rootScope.addCustomer("12345");
        $rootScope.addCustomer("12345");

        expect(config.data.aConfiguredCustomers.length).toBe(1);
    });

    it("should remove a customer from the list", function(){
        $controller("app.premiumEngagement.settingsController", {
            "$scope": $rootScope
        });

        $rootScope.addCustomer("12345");
        $rootScope.addCustomer("45678");
        $rootScope.removeCustomer("12345");

        expect(config.data.aConfiguredCustomers.length).toBe(1);
        expect(config.data.aConfiguredCustomers[0]).toBe("45678");
    });

    it("should reload the ticket data when the config changes", function(){
        $controller("app.premiumEngagement.settingsController", {
            "$scope": $rootScope
        });

        $rootScope.addCustomer("12345");
        expect(ticketData.loadTicketData).toHaveBeenCalled();
    });
});
