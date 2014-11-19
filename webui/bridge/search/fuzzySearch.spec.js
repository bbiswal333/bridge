describe("fuzzy search offers a search on content with misspelling tolerance", function() {
	var fuzzySearch;
	var testData = [{"title":"Old Man's War","author":"John Scalzi"},{"title":"The Lock Artist","author":"Steve Hamilton"},{"title":"HTML5","author":"Remy Sharp"},{"title":"Right Ho Jeeves","author":"P.D. Woodhouse"},{"title":"The Code of the Wooster","author":"P.D. Woodhouse"},{"title":"Thank You Jeeves","author":"P.D. Woodhouse"},{"title":"The DaVinci Code","author":"Dan Brown"},{"title":"Angels & Demons","author":"Dan Brown"},{"title":"The Silmarillion","author":"J.R.R Tolkien"},{"title":"Syrup","author":"Max Barry"},{"title":"The Lost Symbol","author":"Dan Brown"},{"title":"The Book of Lies","author":"Brad Meltzer"},{"title":"Lamb","author":"Christopher Moore"},{"title":"Fool","author":"Christopher Moore"},{"title":"Incompetence","author":"Rob Grant"},{"title":"Fat","author":"Rob Grant"},{"title":"Colony","author":"Rob Grant"},{"title":"Backwards, Red Dwarf","author":"Rob Grant"},{"title":"The Grand Design","author":"Stephen Hawking"},{"title":"The Book of Samson","author":"David Maine"},{"title":"The Preservationist","author":"David Maine"},{"title":"Fallen","author":"David Maine"},{"title":"Monster 1959","author":"David Maine"}];

	beforeEach(function () {
		module("bridge.search");
	    inject(function($injector) {
		    fuzzySearch = $injector.get('bridge.search.fuzzySearch');
		});
	});

	it("should be defined", function() {
		expect(fuzzySearch).toBeDefined();
	});

	it("should hide it's internas", function() {
		var instance = fuzzySearch("test source", {}, {});
		expect(instance.fuse).not.toBeDefined();
	});

	it("should find values in data set by searching only one field", function() {
		var instance = fuzzySearch("test source", testData, {keys: ["author"], threshold: 0.5});
		var resultSet = [];
		instance.findMatches("Jhon", resultSet);
		expect(resultSet.length).toBe(1);

		resultSet.length = 0;
		instance.findMatches("John", resultSet);
		expect(resultSet.length).toBe(1);

		resultSet.length = 0;
		instance.findMatches("Wodhuse", resultSet);
		expect(resultSet.length).toBe(3);
	});

	it("should find values in data set by searching both fields", function() {
		var instance = fuzzySearch("test source", testData, {keys: ["author", "title"], threshold: 0.5});
		var resultSet = [];
		instance.findMatches("Jeve", resultSet);
		expect(resultSet.length).toBe(3);
	});

	it("should convert result items into specific format", function() {
		var instance = fuzzySearch("test source", testData, {keys: ["author", "title"], threshold: 0.5, mappingFn: function(result) { return {title: result.item.author, description: result.item.title}; }});
		var resultSet = [];
		instance.findMatches("Christopher", resultSet);
		expect(resultSet.length).toBe(2);
		expect(resultSet[0].title).toEqual("Christopher Moore");
		expect(resultSet[0].description).toEqual("Lamb");
		expect(resultSet[1].title).toEqual("Christopher Moore");
		expect(resultSet[1].description).toEqual("Fool");
	});
});
