angular.module('app.jenkins').appJenkinsSettings =
['$scope', "app.jenkins.configservice",

	function ($scope, jenkinsConfigService) {    

		$scope.currentConfigValues = jenkinsConfigService.configItem;

		$scope.save_click = function () {  
			$scope.$emit('closeSettingsScreen');
		};

		$scope.add_click = function () {
			if (!$scope.currentConfigValues.isEmpty()) {
				var copiedConfigItem = angular.copy($scope.currentConfigValues);
				$scope.currentConfigValues.clear();
				$scope.config.addConfigItem(copiedConfigItem);
			}
		};

		$scope.limitDisplayName = function(name, limit) {
            if(name.toString().length > limit) {
                return name.toString().substring(0,limit) + " ... ";
            }
            return name;
        };

}];
