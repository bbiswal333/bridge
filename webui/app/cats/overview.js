angular.module('app.cats', ["lib.utils", "app.cats.data", "ngRoute"]);

angular.module("app.cats").directive("app.cats", ["app.cats.configService",
	function (catsConfigService) {
	    var controller = ['$scope', function ($scope) {	        
	        $scope.box.boxSize = "2";
	        $scope.configService = catsConfigService;

	        // $scope.box.settingsTitle = "Configure Work List";
	        // $scope.box.settingScreenData = {
	        //     templatePath: "cats/settings.html",
         //        controller: angular.module('app.cats').catsSettings,
         //        id: $scope.boxId
	        // };  

	        $scope.getCatClass = function(){
	        	$scope.catClass = Math.floor(Math.random() * 2);
	        };

	        $scope.box.returnConfig = function(){
            	return angular.copy($scope.configService);
        	};    
	    }];

	    return {
	        restrict: "E",
            controller: controller,
		    templateUrl: "app/cats/overview.html",
		    link: function ($scope) 
             {
                if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.favoriteItems) 
                 {
                    catsConfigService.favoriteItems = $scope.appConfig.favoriteItems;
                 }            
             }
	    };
}]);