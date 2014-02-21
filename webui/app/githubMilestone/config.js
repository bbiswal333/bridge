angular.module('app.githubMilestone').factory("app.githubMilestone.configservice", function () {

	var configItem = {
		repo: {
					name:"bridge",
					full_name: "Tools/bridge", 
					html_url: "https://github.wdf.sap.corp/Tools/bridge",
					api_url: "https://github.wdf.sap.corp/api/v3/Tools/bridge",
			},	

		milestoneDuration: 7, 	//Available in the Setting screen
		countMilestones : 1, 	//How many milestones will be display
        stateProp : 'open',
        html_url: "https://github.wdf.sap.corp/",
		api_url: "https://github.wdf.sap.corp/api/v3/"
	};
	
	return configItem; 
});