/*global jQuery*/
angular.module('app.programMilestones', ['bridge.controls']);
angular.module('app.programMilestones').directive('app.programMilestones',['app.programMilestones.configFactory', 'app.programMilestones.dataFactory', 
    function (configFactory, dataFactory) {

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

        $scope.box.returnConfig = function() {
            return {
            	programs: config.getPrograms(),
                milestoneTypes: config.getMilestoneTypes()
            };
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

        $scope.getTimes=function(n){
            return new Array(n);
        };

        $scope.formattedDate=function(date){
            if (date) {
             return ""+date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
            } else {
                return '';
            }
        }
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/programMilestones/overview.html',
		controller: directiveController
	};
}]);
