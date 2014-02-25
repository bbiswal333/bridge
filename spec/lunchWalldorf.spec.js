describe("This suite tests various date operations", function () {
	var lunchWalldorf;

	beforeEach(module("app.lunchWalldorf"));
	beforeEach(inject(["app.lunchWalldorf.getDateToDisplay", function (_lunchWalldorf_) {
		 lunchWalldorf = _lunchWalldorf_;
	}]));	

	it ("injected object should contain a poperty called date", function () {
		expect(lunchWalldorf().date).toBeDefined();
	});
});