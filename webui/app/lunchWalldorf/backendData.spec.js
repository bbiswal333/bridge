describe("Lunch BackendData", function(){
    var backendData = null,
        $httpBackend = null;

    beforeEach(function() {
        module("app.lunchWalldorf");

        inject(["$httpBackend", "app.lunchWalldorf.backendData", function(_$httpBackend, _backendData){
            $httpBackend = _$httpBackend;
            backendData = _backendData;
        }]);
    });

    it("should return the backend Data string for the default backend", function(){
        expect(backendData.getDefaultBackend()).toBe("WDF");
    });

    it("should request lunch data for Walldorf", function(){
        backendData.getLunchData(backendData.getDefaultBackend());

        $httpBackend.expectGET(backendData.getBackendMetadata("WDF").portalBackend).respond(201, '');
        $httpBackend.flush();
    });
});
