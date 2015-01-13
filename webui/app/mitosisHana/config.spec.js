describe("Testing mitosisHana.app config service", function () {
	var configService;

	beforeEach(module("app.mitosisHana"));
	beforeEach(inject(["app.mitosisHana.configService", function (_configService_) {
		 configService = _configService_;
	}]));



});
