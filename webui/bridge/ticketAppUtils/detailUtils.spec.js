describe("The ticket app detail utils", function(){
    var detailUtils,
        aPrios = [  { key: "1", description: "Very High", active: false, total: 0 },
            { key: "3", description: "High", active: false, total: 0 },
            { key: "5", description: "Medium", active: false, total: 0 },
            { key: "9", description: "Low", active: false, total: 0 }];

    beforeEach(function(){
        module("bridge.ticketAppUtils");
        inject(["bridge.ticketAppUtils.detailUtils", function(_detailUtils){
            detailUtils = _detailUtils;
        }]);
    });

    it("should provide a filter function for the table", function(){
        var oTicket = {
            DummyProperty: "DummyContent",
            PRIORITY_KEY: "1"
        };

        aPrios[0].active = true;
        expect(detailUtils.ticketMatches(oTicket, "", aPrios)).toBe(true);

        aPrios[0].active = false;
        expect(detailUtils.ticketMatches(oTicket, "", aPrios)).toBe(false);
    });
});
