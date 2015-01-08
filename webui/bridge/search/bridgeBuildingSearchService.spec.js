describe("bridgeBuildingSearchService", function() {
	var testData = '<?xml version="1.0" encoding="UTF-8"?><items xmlns:clean="http://www.google.com" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:enc="java.net.URLEncoder" xmlns:tag="http://www.google.com"><item><objidlong>AMER-AR-BUE-BUE01</objidlong><objidshort>BUE01</objidshort><objlocation>BUE</objlocation><region>AMER</region><country>AR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-34.597333 -58.371815&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://7e362a669050e27398c19c873762523f</portallink><phonenumber>+54 11 4891-3000</phonenumber><countryname>Argentina</countryname><objlocationname>Buenos Aires</objlocationname><obj-type>Office</obj-type><arc-name>BUE01-Alem 855</arc-name><street>Av. L.N. Alem 855, 1001 Ciudad</street><additionalpostalinfo/><houseno/><zip>B1605DII</zip><city>Buenos Aires</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-AR-BUE-BUE04</objidlong><objidshort>BUE04</objidshort><objlocation>BUE</objlocation><region>AMER</region><country>AR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-34.515592 -58.525522&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://4075ce25294fe7495cb46b845cb41595</portallink><phonenumber>+54 11 5544-3600</phonenumber><countryname>Argentina</countryname><objlocationname>Buenos Aires</objlocationname><obj-type>Office</obj-type><arc-name>BUE04-Panamerica Olivos District</arc-name><street>Munro, Sargento Cabral St. 3770</street><additionalpostalinfo/><houseno/><zip>B1605DII</zip><city>Buenos Aires</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-AR-BUE-BUE50</objidlong><objidshort>BUE50</objidshort><objlocation>BUE</objlocation><region>AMER</region><country>AR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-34.620654, -58.365469&amp;z=16&amp;iwloc=A</geolinkB><portallink/><phonenumber>+54 11 4313-4488</phonenumber><countryname>Argentina</countryname><objlocationname>Buenos Aires</objlocationname><obj-type>Office</obj-type><arc-name>BUE50-1780 Alicia Moreau De Justo (Sybase)</arc-name><street>1780 Alicia Moreau De Justo Av.</street><additionalpostalinfo>Units 133, 134 and 43, 65</additionalpostalinfo><houseno/><zip/><city>Buenos Aires</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-BHZ-BHZ02</objidlong><objidshort>BHZ02</objidshort><objlocation>BHZ</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-19.939429 -43.940307&amp;z=16&amp;iwloc=A</geolinkB><portallink/><phonenumber>+55 31 3555-3536</phonenumber><countryname>Brazil</countryname><objlocationname>Belo Horizonte</objlocationname><obj-type>Serviced Office</obj-type><arc-name>BHZ02-Av. do Contorno, 6.594 - 17 andar</arc-name><street>Av. do Contorno, 6.594 - 17 andar</street><additionalpostalinfo>Sala 17</additionalpostalinfo><houseno/><zip>30110-044</zip><city>Belo Horizonte</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-BSB-BSB01</objidlong><objidshort>BSB01</objidshort><objlocation>BSB</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-15.788103 -47.882087&amp;z=16&amp;iwloc=A</geolinkB><portallink/><phonenumber>+55 61 3533-6429</phonenumber><countryname>Brazil</countryname><objlocationname>Brasilia</objlocationname><obj-type>Serviced Office</obj-type><arc-name>BSB01 - Edificio Cento Empresarial Varig</arc-name><street>SCN, Quadra 04, Bloco B, numero 100</street><additionalpostalinfo>sala 1201 12 andar, Asa Norte</additionalpostalinfo><houseno/><zip>70714-900</zip><city>Brasilia</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-POA-POA01</objidlong><objidshort>POA01</objidshort><objlocation>POA</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-30.023448 -51.183608&amp;z=16&amp;iwloc=A</geolinkB><portallink/><phonenumber>+55 51 3378-1032</phonenumber><countryname>Brazil</countryname><objlocationname>Porto Alegre</objlocationname><obj-type>Serviced Office</obj-type><arc-name>POA01 - Av. Carlos Gomes 222</arc-name><street>Avenida Carlos Gomes 222, Boa Vista</street><additionalpostalinfo>08 andar</additionalpostalinfo><houseno/><zip>90480-000</zip><city>Porto Alegre</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-RIO-RIO01</objidlong><objidshort>RIO01</objidshort><objlocation>RIO</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-22.905637 -43.177592&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://f85cbd8df4738bb1adb4913f413c9e89</portallink><phonenumber>+55 21 3526-1100</phonenumber><countryname>Brazil</countryname><objlocationname>Rio de Janeiro</objlocationname><obj-type>Office</obj-type><arc-name>RIO01-Av. Rio Branco n 138 - 8 andar</arc-name><street>Av. Rio Branco n 138 - 8 andar</street><additionalpostalinfo>Sala 802</additionalpostalinfo><houseno/><zip>20040-002</zip><city>Rio de Janeiro</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-RIO-RIO70</objidlong><objidshort>RIO70</objidshort><objlocation>RIO</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-22.702603 -43.414321&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://go.sap.corp/RIO70</portallink><phonenumber>+55 21 3861 6900</phonenumber><countryname>Brazil</countryname><objlocationname>Rio de Janeiro</objlocationname><obj-type>Office</obj-type><arc-name>RIO70-Rua Candelria (Ariba)</arc-name><street>Rua Candelria 65-15andar-Centro</street><additionalpostalinfo/><houseno/><zip>20091-906</zip><city>Rio de Janeiro</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-SAO-SAO02</objidlong><objidshort>SAO02</objidshort><objlocation>SAO</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-23.62233 -46.701744&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://f0e2e21b5ca6a7c45fe716967905d930</portallink><phonenumber>+55 11 5503-2400</phonenumber><countryname>Brazil</countryname><objlocationname>Sao Paulo</objlocationname><obj-type>Office</obj-type><arc-name>SAO02-Marble Tower</arc-name><street>Av das Nacoes Unidas 14171</street><additionalpostalinfo>5 ao 8 ander Sao Paulo</additionalpostalinfo><houseno/><zip>04795-100</zip><city>Sao Paulo</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-SAO-SAO70</objidlong><objidshort>SAO70</objidshort><objlocation>SAO</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-23.563672 -46.654644&amp;z=16&amp;iwloc=A</geolinkB><portallink/><phonenumber>+55 (11)3061-6450</phonenumber><countryname>Brazil</countryname><objlocationname>Sao Paulo</objlocationname><obj-type>Office</obj-type><arc-name>SAO70-Alameda Santos (Ariba)</arc-name><street>Alameda Santos, 2441 - 10 andar</street><additionalpostalinfo/><houseno/><zip>01419-002</zip><city>Sao Paulo</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-BR-SLE-SLE01</objidlong><objidshort>SLE01</objidshort><objlocation>SLE</objlocation><region>AMER</region><country>BR</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=-29.79223 -51.155573&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://afa48e6c9d6097a6455e85b295d6ad0e</portallink><phonenumber>+55 51 3081 1000</phonenumber><countryname>Brazil</countryname><objlocationname>Sao Leopoldo</objlocationname><obj-type>Office</obj-type><arc-name>SLE01-SAP LABs Latin America - Sao Leopoldo</arc-name><street>Avenida SAP, 188 - Cristo Rei</street><additionalpostalinfo/><houseno/><zip>93022-718</zip><city>Sao Leopoldo</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-CAL-CAL02</objidlong><objidshort>CAL02</objidshort><objlocation>CAL</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=51.045414 -114.069242&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://go.sap.corp/CAL02</portallink><phonenumber>+1 403 269-5222</phonenumber><countryname>Canada</countryname><objlocationname>Calgary</objlocationname><obj-type>Office</obj-type><arc-name>CAL02- 855-2nd Street SW</arc-name><street>855-2nd Street SW - Suite 3900</street><additionalpostalinfo/><houseno/><zip>T2P 4K7</zip><city>Calgary</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-MON-MON02</objidlong><objidshort>MON02</objidshort><objlocation>MON</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=45.496567 -73.556406&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://82e05d5839c48f6a546ac68f54bc5c9d</portallink><phonenumber>+1 514 350-7300</phonenumber><countryname>Canada</countryname><objlocationname>Montreal</objlocationname><obj-type>Office</obj-type><arc-name>MON02-111, rue Duke Street</arc-name><street>111, rue Duke Street</street><additionalpostalinfo>Bureau 9000</additionalpostalinfo><houseno/><zip>H3C 2M1</zip><city>Montreal</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-MON-MON75</objidlong><objidshort>MON75</objidshort><objlocation>MON</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=45.50179 -73.574005&amp;z=16&amp;iwloc=A</geolinkB><portallink/><phonenumber>+1 514 866 2664</phonenumber><countryname>Canada</countryname><objlocationname>Montreal</objlocationname><obj-type>Office</obj-type><arc-name>MON75-999 de Maisonneuve Blvd. (Hybris)</arc-name><street>999 de Maisonneuve Blvd. West</street><additionalpostalinfo/><houseno/><zip>H3A3L4</zip><city>Montreal</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-OTT-OTT02</objidlong><objidshort>OTT02</objidshort><objlocation>OTT</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=45.418414 -75.703965&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://5628c9029b16d1abe8c6ae02b1574f25</portallink><phonenumber>+1 (613) 364-2500</phonenumber><countryname>Canada</countryname><objlocationname>Ottawa</objlocationname><obj-type>Office</obj-type><arc-name>OTT02-360 Albert Street</arc-name><street>360 Albert Street</street><additionalpostalinfo>Tower 1- 18th floor</additionalpostalinfo><houseno/><zip>K1R7X7</zip><city>Ottawa</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-TOR-TOR02</objidlong><objidshort>TOR02</objidshort><objlocation>TOR</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=43.746816 -79.408772&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://d6f3557ad333276292e538fa90d5fd7a</portallink><phonenumber>+1 416 229-0574</phonenumber><countryname>Canada</countryname><objlocationname>Toronto</objlocationname><obj-type>Office</obj-type><arc-name>TOR02-4120 Yonge Street</arc-name><street>4120 Yonge Street</street><additionalpostalinfo>6th Floor, Suite 600</additionalpostalinfo><houseno/><zip>M2P 2B8</zip><city>Toronto</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-TOR-TOR04</objidlong><objidshort>TOR04</objidshort><objlocation>TOR</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=43.776687 -79.251809&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://e4088f552c790a5e0e463f80f7eda47f</portallink><phonenumber>+1 416 791-7100</phonenumber><countryname>Canada</countryname><objlocationname>Toronto</objlocationname><obj-type>Office</obj-type><arc-name>TOR04-100 Consilium Place</arc-name><street>100 Consilium Place</street><additionalpostalinfo>Scarborough, Suite 400</additionalpostalinfo><houseno/><zip>M1H 3E3</zip><city>Toronto</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-TOR-TOR06</objidlong><objidshort>TOR06</objidshort><objlocation>TOR</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=43.843875 -79.376693&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://go.sap.corp/tor06</portallink><phonenumber/><countryname>Canada</countryname><objlocationname>Toronto</objlocationname><obj-type>Office</obj-type><arc-name>TOR06-123 Commerce Valley Dr. E. (Camilion)</arc-name><street>123 Commerce Valley Dr. E.</street><additionalpostalinfo>6th Floor</additionalpostalinfo><houseno/><zip>L3T7W8</zip><city>Markham</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-VAN-VAN03</objidlong><objidshort>VAN03</objidshort><objlocation>VAN</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=49.277185 -123.118007&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://portal.wdf.sap.corp/irj/portal?NavigationTarget=navurl://19fb665b22aa14c907ed25995fdb6a9c</portallink><phonenumber>+1 604 647-8888</phonenumber><countryname>Canada</countryname><objlocationname>Vancouver</objlocationname><obj-type>Office</obj-type><arc-name>VAN03-910 Mainland Street</arc-name><street>910 Mainland Street</street><additionalpostalinfo/><houseno/><zip>V6B 1A9</zip><city>Vancouver</city><state/><ao-name>Building</ao-name></item><item><objidlong>AMER-CA-WTO-WTO01</objidlong><objidshort>WTO01</objidshort><objlocation>WTO</objlocation><region>AMER</region><country>CA</country><geolinkB>http://maps.google.de/maps?f=q&amp;source=s_q&amp;hl=de&amp;geocode=&amp;q=43.480048 -80.550342&amp;z=16&amp;iwloc=A</geolinkB><portallink>https://go.sap.corp/WTO01</portallink><phonenumber>+1 519 886-3700</phonenumber><countryname>Canada</countryname><objlocationname>Waterloo</objlocationname><obj-type>Office</obj-type><arc-name>WTO01-445 Wes Graham Way (Sybase)</arc-name><street>445 Wes Graham Way</street><additionalpostalinfo/><houseno/><zip>N2L6R2</zip><city>Waterloo</city><state/><ao-name>Building</ao-name></item></items>';
	var httpBackend;
	var buildingSearch;
	beforeEach(function() {
		module("bridge.service");
		inject(["bridgeBuildingSearch", "$httpBackend", function(_buildingSearch, $httpBackend) {
			buildingSearch = _buildingSearch;
			httpBackend = $httpBackend;
			$httpBackend.when('GET', '/bridge/search/buildings.xml').respond(testData);
		}]);
	});

	it("should find buildings by building ID", function() {
		buildingSearch.searchBuildingById("BUE").then(function(result) {
			expect(result.length).toEqual(3);
			expect(result[0].latitude).toBeDefined();
			expect(result[0].longitude).toBeDefined();
		});
		httpBackend.flush();
	});

	it("should find max number of buildings by building ID", function() {
		buildingSearch.searchBuildingById("BUE", 2).then(function(result) {
			expect(result.length).toEqual(2);
		});
		httpBackend.flush();
	});

	it("should find buildings by building city", function() {
		buildingSearch.searchBuildingByCityAndId("BUEnos").then(function(result) {
			expect(result.length).toEqual(3);
			expect(result[0].latitude).toBeDefined();
			expect(result[0].longitude).toBeDefined();
		});
		httpBackend.flush();
	});

	it("should find max number of buildings by building city", function() {
		buildingSearch.searchBuildingByCityAndId("BUEnos", 2).then(function(result) {
			expect(result.length).toEqual(2);
		});
		httpBackend.flush();
	});

	it("should find SAP locations by city name", function() {
		buildingSearch.searchLocation("buenos").then(function(result) {
			expect(result.length).toEqual(1);
			expect(JSON.stringify(result)).toEqual('[{"name":"Buenos Aires","latitude":-34.597333,"longitude":-58.371815}]');
		});
		httpBackend.flush();
	});
});
