module("Config");
test("test ConfigItem getQueryString", function() {
	var myConfigItem = createConfigItemForSystem("V7Z");
	
	equal(myConfigItem.getQueryString(), "V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;;X;;X", "queryString calculated correct");
});

function createConfigItemForSystem(System) {
	var myConfigItem = new ConfigItem();
	
	myConfigItem.srcSystem = System;
	myConfigItem.devClass = "S_DEVREPORTING";
	myConfigItem.tadirResponsible = "D051804";
	myConfigItem.component = "BA-BS";
	myConfigItem.showSuppressed = true;
	myConfigItem.displayPrio1 = true;
	myConfigItem.displayPrio3 = true;
	myConfigItem.onlyInProcess = true;
	return myConfigItem;
}

test("test Config", function() {
	var myConfig = new Config();
	myConfig.addConfigItem(createConfigItemForSystem("V7Z"));
	
	equal(myConfig.getQueryString(), "V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;;X;;X", "config queryString calculated correct for 1 config item");
	
	myConfig.addConfigItem(createConfigItemForSystem("CI3"));
	equal(myConfig.getConfigItems().length, 2, "Config items added");
	
	equal(myConfig.getQueryString(), "V7Z;S_DEVREPORTING;D051804;BA-BS;X;X;;X;;X|CI3;S_DEVREPORTING;D051804;BA-BS;X;X;;X;;X", "config queryString calculated correct");
});