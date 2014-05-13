angular.module('app.imtl', []);

angular.module('app.imtl').directive('app.imtl', ['app.imtl.configservice', function (appImtlConfig) {

    var directiveController = ['$scope' , 'bridgeCounter', function ($scope, bridgeCounter) {
        $scope.boxTitle = "Internal Messages";
        $scope.boxIcon = '&#xe81b;';
        $scope.boxIconClass = 'icon-comment-empty';
		
        bridgeCounter.CollectWebStats('INTERNAL_MESSAGES', 'APPLOAD'); 
		
        $scope.settingsTitle = "Configure Traffic Light";
        $scope.settingScreenData = {
            templatePath: "imtl/settings.html",
			controller: angular.module('app.imtl').appImtlSettings,
        };
		
		$scope.returnConfig = function(){
            return appImtlConfig.trafficlightquery;
        }
		
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/imtl/overview.html',
        controller: directiveController,
/*		link: function ($scope, $element, $attrs, $modelCtrl) {
            if ($scope.appConfig != undefined) {
                appImtlConfig.trafficlightquery = $scope.appConfig;
            }
        }*/
    };
}]);

    angular.module('app.imtl').run(function ($rootScope) {
});

angular.module('app.imtl').controller('app.imtl.directiveController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.prioarr = [0,0,0,0];
        $scope.prionr = [1,2,3,4];
        $scope.$parent.titleExtension = " - Internal Messages"; 
		
		var updateTrafficLight = function ($scope) {
			if( $scope.prioarr[0] ){
				console.log( 'turn red on' );
				//window.client.origin
				$http.get('/api/trafficLight?color=r');
			}else if( $scope.prioarr[1] ){
				console.log( 'turn yellow on' );
				$http.get('/api/trafficLight?color=y');
			}else{
				console.log( 'turn green on' );
				$http.get('/api/trafficLight?color=g');
			}
		}	
		
        $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?origin=' + location.origin
            ).success(function(data) {
                data = new X2JS().xml_str2json(data);
                $scope.imData = data["abap"];
                $scope.imData = $scope.imData["values"];
				
                _.each($scope.imData.INTCOMPCOLLEAGUES_LONG.DEVDB_INTMESSAGE_OUT, function (n) {
                    _.each($scope.prionr, function (u,i) {
                        i = i + 1;
                        if(n.PRIO == i.toString())
                            $scope.prioarr[i-1] ++;
                    });
                });
                if ( ($scope.prioarr[0] + $scope.prioarr[1] + $scope.prioarr[2] + $scope.prioarr[3]) == 0) {
                    $scope.lastElement="You have no internal messages to display!";
                    $scope.displayChart = false;
                }                
                else
                {
                    $scope.displayChart = true;
                }
				updateTrafficLight($scope);
            }).error(function(data) {
                $scope.imData = [];                
            });
}]);
    
