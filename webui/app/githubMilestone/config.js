angular.module('app.githubMilestone').factory("app.githubMilestone.configservice", function () {

	var configItem = {
		repo: {
					name:"bridge",
					full_name: "bridge/bridge", 
					html_url: "https://github.wdf.sap.corp/bridge/bridge",
					api_url: "https://github.wdf.sap.corp/api/v3/bridge/bridge"
			},	

		milestoneDuration: 7, 	
		countMilestones : 1, 
        stateProp : 'open',
        html_url: "https://github.wdf.sap.corp/",
		api_url: "https://github.wdf.sap.corp/api/v3/",
		fork: false
	};
	
	return configItem; 
});
