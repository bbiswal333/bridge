var TimeService = require("./timeService.js");

module.exports = function(app) {
		var ts = new TimeService();
	app.get("/api/worldClock/getOffset", function(request, response) {
		ts.getTimeOffsetFor(request.query.zoneID, function(offset) {
			response.send({
				offset: offset
			});
		});
	});
	app.get("/api/worldClock/getTimeZones", function(request, response) {
		ts.getTimeZones(function(timeZones) {
			response.send({
				timeZones: timeZones
			});
		});
	});
}