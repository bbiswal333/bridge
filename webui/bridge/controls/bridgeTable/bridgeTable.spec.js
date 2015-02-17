describe("The bridge table directive", function(){
    var $rootScope, $compile;

    beforeEach(function(){
        module('templates');
        module('bridge.controls');

        inject(function(_$rootScope_, _$compile_){
            $rootScope = _$rootScope_;
            $compile = _$compile_;
        });

        $rootScope.testdata = [{
            testattribute: "hallo1",
            testattribute2: "hallo12"
        }, {
            testattribute: "hallo2",
            testattribute2: "hallo22"
        },{
            testattribute: "hallo3",
            testattribute2: "hallo32"
        }];
    });

    it("should display me a table with three rows and two columns", function(){
        var element = angular.element('' +
            '<bridge.table table-data="testdata" >' +
                "<bridge.table-column column-id=\"'1\'\" header=\"'Test'\" column-size-class=\"'col-sm-1'\" order-by=\"'testattribute'\">{{row.testattribute}}</bridge.table-column>" +
                "<bridge.table-column column-id=\"'2'\" header=\"'Test'\" column-size-class=\"'col-sm-1'\" order-by=\"'testattribute2'\">{{row.testattribute2}}</bridge.table-column>" +
            '</bridge.table>');

        $compile(element)($rootScope);
        $rootScope.$digest();

        expect(element.get(0).nodeName).toBe("BRIDGE.TABLE");
    });

    it("should not display one of the two columns", function(){
        $rootScope.visibility = [true, false];

        var element = angular.element('' +
            '<bridge.table table-data="testdata" >' +
                "<bridge.table-column column-id=\"'1\'\" header=\"'Test'\" column-size-class=\"'col-sm-1'\" order-by=\"'testattribute'\" visible='parentScope.visibility[0]'>{{row.testattribute}}</bridge.table-column>" +
                "<bridge.table-column column-id=\"'2'\" header=\"'Test'\" column-size-class=\"'col-sm-1'\" order-by=\"'testattribute2'\" visible='parentScope.visibility[1]'>{{row.testattribute2}}</bridge.table-column>" +
            '</bridge.table>');

        $compile(element)($rootScope);
        $rootScope.$digest();

        expect(element.find(".box-title.col-sm-1").length).toBe(1);
    });
});
