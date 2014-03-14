describe("The Employee Search should display SAP Users according to the Search string", function () {

    var $rootScope;
    var $httpBackend;
    var $compile;

    beforeEach(function () {

        module("bridge.employeeSearch");

        inject(["$rootScope", "$httpBackend", "$compile", function (rootScope, httpBackend, compile) {
            $rootScope = rootScope;
            $compile = compile;
            $httpBackend = httpBackend;

            $httpBackend.whenGET("bridge/employeeSearch/EmployeeSearchDirective.html").respond("<div></div>");
            $httpBackend.whenGET(/https:\/\/ifp\.wdf\.sap.corp:443\/sap\/bc\/zxa\/FIND_EMPLOYEE_JSON\?maxrow=20&query=Schueler/).respond(employeeSearchData);
        }]);
    });

    it("shoud return an Employee for Search String Schueler", function () {
        var element = $compile('<bridge.employee-search selected-employee="selectedEmployee" placeholder="\'Name...\'" required="false"></bridge.employee-seearch>')($rootScope);
        $httpBackend.flush();
        $rootScope.$digest();
        
        var directiveScope = element.isolateScope();
        var promise = directiveScope.doSearch("Schueler");
        promise.then(function success(data) {
            expect(data.length).toBe(6);
        });
        $httpBackend.flush();
    });

    var employeeSearchData = { "DATA": [{ "BNAME": "D030212", "VORNA": "Arnulf", "NACHN": "Schueler", "BNAME_STR": "D030212 Arnulf Schueler" }, { "BNAME": "C5065029", "VORNA": "Hans", "NACHN": "Schueler", "BNAME_STR": "C5065029 Hans Schueler" }, { "BNAME": "D051804", "VORNA": "Daniel", "NACHN": "Schueler", "BNAME_STR": "D051804 Daniel Schueler" }, { "BNAME": "I826687", "VORNA": "Jack", "NACHN": "Schueler", "BNAME_STR": "I826687 Jack Schueler" }, { "BNAME": "C5187726", "VORNA": "Ricarda", "NACHN": "Schueler", "BNAME_STR": "C5187726 Ricarda Schueler" }, { "BNAME": "I840490", "VORNA": "Ricarda", "NACHN": "Schueler", "BNAME_STR": "I840490 Ricarda Schueler" }] };
});  