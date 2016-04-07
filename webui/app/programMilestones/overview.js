/*global jQuery*/
angular.module('app.programMilestones', []);
angular.module('app.programMilestones').directive('app.programMilestones',['app.programMilestones.configFactory', 'app.programMilestones.dataFactory', function (configFactory, dataFactory) {

	var directiveController = ['$scope', function ($scope) {
        jQuery.timeago.settings.allowFuture = true;

		var config = configFactory.getConfigForAppId($scope.metadata.guid);
		var data = dataFactory.getDataForAppId($scope.metadata.guid);

		$scope.box.boxSize = 2;

		$scope.box.settingScreenData = {
            templatePath: "programMilestones/settings.html",
            controller: angular.module('app.programMilestones').appProgramSettings,
            id: $scope.boxId
        };

        $scope.programs = config.getPrograms();
        $scope.milestoneTypes = config.getMilestoneTypes();

        config.isInitialized().then(function() {
            data.refreshMilestones().then(function() {
                $scope.milestones = data.getMilestones();
            });
        });

        $scope.getTimeAgo = function(dDate) {
            return $.timeago(dDate.getTime());
        };
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/programMilestones/overview.html',
		controller: directiveController
	};
}]);
