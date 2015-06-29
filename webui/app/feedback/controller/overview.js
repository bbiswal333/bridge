angular.module('app.feedback', []);
angular.module('app.feedback').directive('app.feedback',['app.feedback.configService',function (configService) {

	var directiveController = ['$scope','$location','feedback', function ($scope,$location,feedback) {
		$scope.text = "Meine Antwort!";
		$scope.box.boxSize = 2;
		$scope.question="Hier steht meine Frage?";



		$scope.box.settingScreenData = {
			templatePath: "feedback/settings.html",
			controller: angular.module('app.feedback').appFeedbackSettings,
			id: $scope.boxId
		};

		$scope.box.headerIcons = [{
			iconCss: "fa-plus",
			title: "Create Ticket",
			callback: function(){
				$location.path("/add/feedback");
				feedback.setQuestion($scope);
			}

		},
			{
				iconCss: "fa-plus",
				title: "Create Ticket",
				callback: function(){
					$window.open("https://itdirect.wdf.sap.corp/sap/bc/bsp/sap/crm_ui_start/default.htm");
				}
			},
			{
				iconCss: "fa-plus",
				title: "Create Ticket",
				callback: function(){
					$window.open("https://itdirect.wdf.sap.corp/sap/bc/bsp/sap/crm_ui_start/default.htm");
				}
			},
			{
				iconCss: "fa-rss",
				title: "Create Ticket",
				callback: function(){
					$window.open("https://itdirect.wdf.sap.corp/sap/bc/bsp/sap/crm_ui_start/default.htm");
				}
			}];
		$scope.start = function(){
			if($scope.text.length>=10){
				$scope.text += "...";
			}
		};
		$scope.start();
	}];

	//var linkFn = function ($scope) {
    //
	//	// get own instance of config service, $scope.appConfig contains the configuration from the backend
	//	configService.initialize($scope.appConfig);
    //
	//	// watch on any changes in the settings screen
	//	$scope.$watch("appConfig.values.boxSize", function () {
	//		$scope.box.boxSize = $scope.appConfig.values.boxSize;
	//	}, true);
	//};

	return {
		restrict: 'E',
		templateUrl: 'app/feedback/overview.html',
		controller: directiveController
		//link: linkFn
	};


}]);
