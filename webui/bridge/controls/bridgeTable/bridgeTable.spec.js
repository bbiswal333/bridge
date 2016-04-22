describe("The bridge table directive", function(){
    var $rootScope, $compile, $timeout;

    beforeEach(function(){
        module('templates');
        module('bridge.controls');

        inject(function(_$rootScope_, _$compile_, _$timeout_){
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $timeout = _$timeout_;
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
                    "<bridge.table-column header=\"'Test'\" order-by=\"testattribute\" field=\"testattribute\"></bridge.table-column>" +
                    "<bridge.table-column header=\"'Test 2'\" order-by=\"testattribute2\" field=\"testattribute2\"></bridge.table-column>" +
            '</bridge.table>');

        $compile(element)($rootScope);
        $rootScope.$digest();

        expect(element.get(0).nodeName).toBe("BRIDGE.TABLE");
    });

    it("should not display one of the two columns", function(){
        $rootScope.tableSettings = {
            state: {
                columns: [{
                    name: 'Test',
                    pinned: "",
                    sort: {},
                    visible: true,
                    width: 240
                }, {
                    name: 'Test 2',
                    pinned: "",
                    sort: {},
                    visible: false,
                    width: 240
                }]
            }
        };

        var element = angular.element('' +
            '<bridge.table table-data="testdata" table-settings="tableSettings" >' +
                    "<bridge.table-column header=\"'Test'\" order-by=\"testattribute\" field=\"testattribute\"></bridge.table-column>" +
                    "<bridge.table-column header=\"'Test 2'\" order-by=\"testattribute2\" field=\"testattribute2\"></bridge.table-column>" +
            '</bridge.table>');

        $compile(element)($rootScope);
        $rootScope.$digest();
        $timeout.flush(); // needed to apply the tableSettings because their are encapsulated in a $timeout in the table directive

        expect(element.find(".ui-grid-header-cell").length).toBe(2); // 1 for the actual column and 1 for the selector cell that is the first cell in each row
    });

    it("should sort the table columns", function(){
        $rootScope.tableSettings = {
            state: {
                columns: [{
                    name: 'Test 2',
                    pinned: "",
                    sort: {},
                    visible: true,
                    width: 240

                }, {
                    name: 'Test 1',
                    pinned: "",
                    sort: {},
                    visible: true,
                    width: 240
                }]
            }
        };

        var element = angular.element('' +
            '<bridge.table table-data="testdata" table-settings="tableSettings" >' +
                    "<bridge.table-column header=\"'Test 1'\" order-by=\"testattribute\" field=\"testattribute\"></bridge.table-column>" +
                    "<bridge.table-column header=\"'Test 2'\" order-by=\"testattribute2\" field=\"testattribute2\"></bridge.table-column>" +
            '</bridge.table>');

        $compile(element)($rootScope);
        $rootScope.$digest();
        $timeout.flush(); // needed to apply the tableSettings because their are encapsulated in a $timeout in the table directive

        expect(element.find(".ui-grid-header-cell-label")[0].innerHTML).toMatch(/Test 2/gi);
        expect(element.find(".ui-grid-header-cell-label")[1].innerHTML).toMatch(/Test 1/gi);
    });
});
