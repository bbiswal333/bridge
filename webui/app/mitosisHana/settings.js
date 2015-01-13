angular.module('app.mitosisHana').appMitosisHanaSettings = ['$scope', "app.mitosisHana.configService", "app.mitosisHana.dataService", function ($scope, configService, dataService) {

	$scope.config = configService.values;
	$scope.dataService = dataService;

	$scope.changeContentStatus = function (content) {
		if(configService.values.content[content] && configService.values.content[content].active === 0)
			configService.values.content[content].active = 1;
		else if(configService.values.content[content] && configService.values.content[content].active === 1)
			configService.values.content[content].active = 0;
		else
			configService.values.content[content] = {"active" : 1};


		dataService.updateContentToDisplay();
	};

	$scope.save_click = function () {
		$scope.$emit('closeSettingsScreen'); // Persisting the settings
	};
}];
