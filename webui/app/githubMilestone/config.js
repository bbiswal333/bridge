angular.module('app.githubMilestone').factory("app.githubMilestone.configservice", function () {



	var configItem = {
		repo: "Tools/bridge",
		milestoneDuration: 7
	};
	
	return configItem; 
});