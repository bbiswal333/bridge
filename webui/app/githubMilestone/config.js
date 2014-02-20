angular.module('app.githubMilestone').factory("app.githubMilestone.configservice", function () {

	var configItem = {
		repo: "Tools/bridge",	//Available in the Setting screen
		milestoneDuration: 7, 	//Available in the Setting screen
		countMilestones : 1, 	//How many milestones will be display
        stateProp : 'open',		
        urlGithub : 'https://github.wdf.sap.corp/',		//URL to Github
        urlApi : "https://github.wdf.sap.corp/api/v3/"	//URL to the Github API
	};
	
	return configItem; 
});