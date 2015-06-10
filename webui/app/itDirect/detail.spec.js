describe("IT Direct details controller", function(){
    var controller = null;
    var $rootScope = null;
    var ticketDataMock = {
        getInstanceForAppId: function() {
            return {
                isInitialized: false,
                tickets: {
                    assigned_me: [],
                    savedSearch: []
                },
                activatePrio: function(){
                }
            }
        }
    };

    beforeEach(function(){
        module("app.itdirect");

        inject(["$rootScope", "$controller", function(_$rootScope, _$controller){
            controller = _$controller("app.itdirect.detailController", {
                "$scope": _$rootScope,
                "$routeParams": {},
                "bridgeDataService": {},
                "app.itdirect.ticketData": ticketDataMock,
                "app.itdirect.config": {
                    getConfigForAppId: function() {
                        return {isInitialized: true};
                    }
                }
            });

            $rootScope = _$rootScope;
        }]);
    });

    it("should tell me if I has a ticket with a specific GUID", function(){
        $rootScope.tickets.push({ GUID: "abc"});
        expect(controller.containsTicket("abc")).toBe(true);
        expect(controller.containsTicket("efg")).toBe(false);
    });
});
