angular.module('app.imtl', []);

angular.module('app.imtl').directive('app.imtl', function () {

    var directiveController = ['$scope' ,'app.imtl.configservice', 'bridgeCounter', function ($scope, appimconfigservice, bridgeCounter) {
        $scope.boxTitle = "Internal Messages";
        $scope.boxIcon = '&#xe81b;';
        bridgeCounter.CollectWebStats('INTERNAL_MESSAGES_TL', 'APPLOAD');
        $scope.boxNeedsClient = true;
        /*$scope.settingsTitle = "Settings";

        $scope.settingScreenData = {
            templatePath: "im/settings.html",
                controller: angular.module('app.imtl').appImSettings,
                id: $scope.boxId,
            };*/
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/imtl/overview.html',
        controller: directiveController
    };
});

    angular.module('app.imtl').run(function ($rootScope) {
});

angular.module('app.imtl').controller('app.imtl.directiveController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.prioarr = [0,0,0,0];
        $scope.prionr = [1,2,3,4];
        $scope.displayChart = true;
        $scope.$parent.titleExtension = " - Internal Messages w/ Traffic Light";
        $scope.lastElement = "";        
        $http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS') + '&json=true'
            ).success(function(data) {
                
                $scope.imData = data["asx:abap"];
                $scope.imData = $scope.imData["asx:values"];
                $scope.imData = $scope.imData[0];
                $scope.tempobject = [];
                
                if ($scope.imData.INTCOMP_LONG[0] !== "") {
                    _.each($scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT, function (n) {$scope.tempobject.push(n); });
                }

                _.each($scope.tempobject, function (n) { 
                    _.each($scope.prionr, function (u,i) {
                        i = i + 1;
                        if(n.PRIO[0] == i)
                            $scope.prioarr[i-1] ++;
                    });
                });
                if ( ($scope.prioarr[0] + $scope.prioarr[1] + $scope.prioarr[2] + $scope.prioarr[3]) == 0) {
                    $scope.lastElement="You have no internal messages to display!";
                    $scope.displayChart = false;
                }                

            }).error(function(data) {
                $scope.imData = [];                
            });
   
            var updateimChart = function ($scope) {
				var chart1 = {};
					 
				chart1.type = "PieChart";
				chart1.cssStyle = "height:150px; width:100%;";
				chart1.displayed = true;

				chart1.data = {
					"cols": [
						{ id: "prio", label: "Priority", type: "string" },
						{ id: "numberMessages", label: "Message(s)", type: "number" },
					], "rows": [
					{
						c: [
						   { v: "Prio 1 (" + $scope.prioarr[0] + ")"},
						   { v: $scope.prioarr[0], f: $scope.prioarr[0] + " Messages" }
						]
					},
					{
						c: [
						   { v: "Prio 2 (" + $scope.prioarr[1] + ")"},
						   { v: $scope.prioarr[1], f: $scope.prioarr[1] + " Messages" }
						]
					},
					{
						c: [
						   { v: "Prio 3 (" + $scope.prioarr[2] + ")"},
						   { v:  $scope.prioarr[2], f: $scope.prioarr[2] + " Messages"  }
						]
					},
					{
						c: [
						   { v: "Prio 4 (" + $scope.prioarr[3] + ")"},
						   { v:  $scope.prioarr[3], f: $scope.prioarr[3] + " Messages"  }
						]
					}
				]};

				chart1.options = {
					"title": "",
					"sliceVisibilityThreshold": 0,
					"colors": ['#097AC5', '#5CCCFF', '#AFE5FF', '#E6F7FF'],
					"pieHole": 0.75,
					"fill": 10,
					"displayExactValues": false,
				};

				chart1.formatters = {};
				$scope.imChart = chart1;

			}

			var updateTrafficLight = function ($scope) {
				if( $scope.prioarr[0] ){
					console.log( 'turn red on' );
					$http.get('http://localhost:8000/api/trafficLight?color=r');
				}else if( $scope.prioarr[1] ){
					console.log( 'turn yellow on' );
					$http.get('http://localhost:8000/api/trafficLight?color=y');
				}else{
					console.log( 'turn green on' );
					$http.get('http://localhost:8000/api/trafficLight?color=g');
				}
			}
			
			$scope.$watch('imData', function () {
				updateimChart($scope);
				updateTrafficLight($scope);
			});
}]);
    
